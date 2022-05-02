import { removeAll, isWebp } from "./utilities/functions.js"

// Плейсхолдер текстовых полей
// labelTextfield()
function labelTextfield() {
    const textfieldElems = document.querySelectorAll('.tf')

    for (let i = 0; i < textfieldElems.length; i++) {
        const textfield = textfieldElems[i];
        const input = textfield.querySelector('input, textarea')
        const label = textfield.querySelector('label')

        if (input.value != '') {
            label.classList.add('_change-label')
        }

        input.addEventListener('focus', e => {
            label.classList.add('_change-label')
        })
        
        input.addEventListener('blur', e => {
            if (input.value === '') {
                label.classList.remove('_change-label')
            }
        })
    }
}

window.addEventListener('click', e => {
    const target = e.target

    if (target.nodeName == 'INPUT') {
        textfieldRemoveError(target.closest('.tf'))
    }
})

const formSignIn = document.querySelector('#form-sign-in')
const signInInputElems = formSignIn.querySelectorAll('.tf input[data-tf-required]')

formSignIn.addEventListener('submit', async e => {
    let validForm = true
    e.preventDefault()
    
    // Проверка на пустоту
    signInInputElems.forEach(input => {
        if (textfieldEmpty(input)) {
            validForm = false
        }
    })
    
    if (validForm === false) {
        console.log('Форма не до конца заполнена!')
        return
    }

    const formData = new FormData(formSignIn)
    const formAction = formSignIn.getAttribute('action')

    const response = await fetch(formAction, {
        method: 'POST',
        body: formData,
    })

    if (response.ok) {
        resetForm(formSignIn)
    }
    else {

        setTimeout(e => {

            console.error("Ошибка HTTP: " + response.status)
        }, 2000)
    }
})

function resetForm(form) {
    form.reset()

    const tfElems = form.querySelectorAll('.tf')

    for (let i = 0; i < tfElems.length; i++) {
        const tf = tfElems[i]
        const tfLabel = tf.querySelector('label')
        
        tfLabel.classList.remove('_change-label')
    }
}

// Если пустое поле...
function textfieldEmpty(textfield) {
    if (textfield.value.trim() == '') {
        textfieldAddError(textfield.closest('.tf'), 'Поле не должно быть пустым')
        return true
    }
}

// Добавить ошибку
function textfieldAddError(textfield, errorText) {
    textfield.dataset.textfieldError = errorText
    textfield.classList.add('_textfield-error')
}

// Удалить ошибку
function textfieldRemoveError(textfield) {
    textfield.removeAttribute('data-textfield-error')
    textfield.classList.remove('_textfield-error')
}