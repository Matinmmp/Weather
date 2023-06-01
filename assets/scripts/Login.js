import Request from './Request.js';

const email = document.getElementById('email');
const password = document.getElementById('password');
const sub = document.getElementById('sub');
const rememberMe = document.getElementById('rememberMe');
const loading = document.getElementById('loading');


const request = new Request({
    baseURL: 'https://646521939c09d77a62e4a2ef.mockapi.io/Todos/user',
    headers: { 'Content-Type': 'application/json' }
})

checkRememberMe();

sub.addEventListener('click', () => {
    if (email.value === '' || password.value === '') {
        alert('Pleas fill all inputs');
        return;
    }
    checkUser();
});

async function checkUser() {
    loading.classList.replace('hidden', 'flex');
    const response = await request.get();
    const user = response.find(item => item.email === email.value);

    if (!user) {
        alert('there is no user with this email');
        return;
    }
    if (user.password !== password.value) {
        alert('your password is incorect');
        return;
    }
    try {
        user.isLogin = true;
        await request.edit(`/${user.id}`, user);
        setUserInfo(user);
        loading.classList.replace('flex', 'hidden');
        // setTimeout(() => alert('your are loged'), 200);
        setTimeout(() => window.location.replace("./Home.html"), 300);
    } catch (error) {
        alert('somthing went wrong');
    }
    loading.classList.replace('flex', 'hidden');
}

function setUserInfo(obj) {
    obj.isLogin = true
    obj.rememberMe = rememberMe.checked;
    const userInfo = localStorage.getItem('user');
    if (!userInfo) {
        localStorage.setItem('user', JSON.stringify(obj));
        return;
    }
    else
        localStorage.setItem('user', JSON.stringify(obj));
}


function checkRememberMe(){
    const userInfo = JSON.parse(localStorage.getItem('user'));
    if (userInfo.rememberMe) {
        email.value = userInfo.email;
        password.value = userInfo.password; 
        rememberMe.checked = true;
    }
}
