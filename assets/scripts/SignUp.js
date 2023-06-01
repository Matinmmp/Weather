import Request from './Request.js';

const email = document.getElementById('email');
const password = document.getElementById('password');
const rePassword = document.getElementById('rePassword');
const sub = document.getElementById('sub');
const loading = document.getElementById('loading');
const request = new Request({
    baseURL: 'https://646521939c09d77a62e4a2ef.mockapi.io/Todos/user',
    headers: { 'Content-Type': 'application/json' }
})


const postUser = async (input) => {

    loading.classList.replace('hidden', 'flex');

    const response = await request.get();
    const isExist = response.some(item => item.email === input);
    if (isExist) {
        loading.classList.replace('flex', 'hidden');
        setTimeout(() => alert('This email has already been registered'), 200);
        return;
    }
    const obj = {
        email: email.value,
        password: password.value,
        isLogin: false
    }
    try {
        await request.post(undefined, obj);
        loading.classList.replace('flex', 'hidden');
        setTimeout(() => alert('your sign up was susuccessful'), 200);
        setTimeout(()=>window.location.replace("./login.html"),500);

    } catch (error) {
        loading.classList.replace('flex', 'hidden');
        setTimeout(() => alert(`your sign up wasnt susuccessful
        try it again`), 200);

    }
    loading.classList.replace('flex', 'hidden');
    console.log("ASDfadsf");
}


sub.addEventListener('click', () => {
    if (email.value === '' || password.value === '' || rePassword.value === '') {
        alert('Pleas fill all inputs');
        return;
    }
    if (password.value !== rePassword.value) {
        alert('passwords are not equal');
        return
    }
    postUser(email.value);
});
