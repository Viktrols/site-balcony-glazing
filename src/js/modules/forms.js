import checkNumInputs from './checkNumInputs';


const forms = (state) => {
    const allForms = document.querySelectorAll('form'),
          allInputs = document.querySelectorAll('input');
    
    checkNumInputs('input[name="phone"]');

    const messages = {
        loading: 'Загрузка',
        success: 'Спасибо! Скоро мы с Вами свяжемся.',
        error: 'Что-то пошло не так...'
    };

    const postData = async (url, data) => {
        document.querySelector('.status').textContent = messages.loading;
        let res = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-type': 'application/json; charset=utf-8'
                },
            body: data
        });
        return await res.json();
    };

    const clearInputs = () => {
        allInputs.forEach(input => {
            input.value = '';
        });
    };

    allForms.forEach(item => {
        item.addEventListener('submit', (e) => {
            e.preventDefault();

            let statusMessage = document.createElement('div');
            statusMessage.classList.add('status');
            item.appendChild(statusMessage);
            
            const formData = new FormData(item);
            if (item.getAttribute('data-calc') === 'end') {
                for (let key in state) {
                    formData.append(key, state[key]);
                }
            }
            const formDataJSON = JSON.stringify(Object.fromEntries(formData.entries()));
            postData('http://127.0.0.1:8000/contacts/', formDataJSON)
                .then(res => {
                    statusMessage.textContent = messages.success;
                }).catch(() => {
                    console.log(res);
                    statusMessage.textContent = messages.error;
                    }).finally(() => {
                        clearInputs();
                        setTimeout(() => {
                            statusMessage.remove();
                        }, 5000);
                    });
            });
    });
};

export default forms;