// import slider from './slider.js';
// import modals from './modules/modals.js';
// import tabs from './modules/tabs.js';
// import forms from './modules/forms.js';
// import changeModalState from './modules/changeModalState.js';
// import timer from './modules/timer.js';
// import images from './modules/images.js';

window.addEventListener('DOMContentLoaded', () => {
    "use strict";

    // CHECK NUM INPUTS
    const checkNumInputs = (selector) => {
        const numInputs = document.querySelectorAll(selector);
    
        numInputs.forEach(item => {
            item.addEventListener('input', () => {
                item.value = item.value.replace(/\D/, '');
            });
        });
    };

    // CHANGE MODAL STATE
    const changeModalState = (state) => {
        // везде используем querySelectorAll чтобы получать псевдомассив,
        // необходимый для функции bindActionToElems
        const windowForm = document.querySelectorAll('.balcon_icons_img'),
              windowWidth = document.querySelectorAll('#width'),
              windowHeight = document.querySelectorAll('#height'),
              windowType = document.querySelectorAll('#view_type'),
              windowProfile = document.querySelectorAll('.checkbox');
    
        checkNumInputs('#width');
        checkNumInputs('#height');
    
        function bindActionToElems(event, elem, prop) {
            elem.forEach((item, i) => {
                item.addEventListener(event, () => {
                    switch(item.nodeName) {
                        case 'SPAN':
                            state[prop] = i;
                            break;
                        case 'INPUT':
                            if (item.getAttribute('type') === 'checkbox') {
                                i === 0 ? state[prop] = 'Холодное' : state[prop] = 'Теплое';
                                elem.forEach((box, j) => {
                                    box.checked = false;
                                    if (i == j) {
                                        box.checked = true;
                                    }
                                });
                            } else {
                                state[prop] = item.value;
                            }
                            break;
                        case 'SELECT':
                            state[prop] = item.value;
                            break;
                    }
    
                    console.log(state);
                });
            });  
        }
        
        bindActionToElems('click', windowForm, 'form');
        bindActionToElems('input', windowHeight, 'height');
        bindActionToElems('input', windowWidth, 'with');
        bindActionToElems('change', windowType, 'type');
        bindActionToElems('change', windowProfile, 'profile');
    };

    // FORMS
    const forms = (state) => {
        const form = document.querySelectorAll('form'),
              inputs = document.querySelectorAll('input');
    
        checkNumInputs('input[name="user_phone"]');
    
        const message = {
            loading: 'Загрузка...',
            success: 'Спасибо! Скоро мы с Вами свяжемся!',
            failure: 'Что-то пошло не так...'
        };
    
        const postData = async (url, data) => {
            document.querySelector('.status').textContent = message.loading;
            let result = await fetch(url, {
                method: "POST",
                body: data,
            });
    
            return await result.text();
        };
    
        const clearInputs = () => {
            inputs.forEach(input => {
                input.value = '';
            });
        };
    
        form.forEach(item => {
            item.addEventListener('submit', (e) => {
                e.preventDefault();
                
                let statusMsg = document.createElement('div');
                statusMsg.classList.add('status');
                item.appendChild(statusMsg);
    
                const formData = new FormData(item);
                if (item.getAttribute('data-calc') === 'end') {
                    for (let key in state) {
                        formData.append(key, state[key]);
                    }
                }
    
                postData('../../server.php', formData)
                    .then(res => {
                        console.log(res);
                        statusMsg.textContent = message.success;
                    })
                    .catch(() => statusMsg.textContent = message.failure)
                    .finally(() => {
                        clearInputs();
                        setTimeout(() => {
                            statusMsg.remove();
                        }, 5000);
                    });
            });
        });
    };

    // IMAGES
    const images = () => {
        const imgPopup = document.createElement('div'),
              workSection = document.querySelector('.works'),
              bigImage = document.createElement('img');
    
        imgPopup.classList.add('popup');
        workSection.appendChild(imgPopup);
        
        imgPopup.style.justifyContent = 'center';
        imgPopup.style.alignItems = 'center';
        imgPopup.style.display = 'none';
    
        imgPopup.appendChild(bigImage);
    
        workSection.addEventListener('click', (e) => {
            e.preventDefault();
    
            let target = e.target;
    
            if (target && target.classList.contains('preview')) {
                imgPopup.style.display = 'flex';
                const path = target.parentNode.getAttribute('href');
                bigImage.setAttribute('src', path);
                document.body.style.overflow = 'hidden';
            }
    
            if (target && target.matches('div.popup')) {
                imgPopup.style.display = 'none';
                document.body.style.overflow = '';
            }
        });
    };

    // MODALS
    const modals = () => {
        function bindModal(triggerSelector, modalSelector, closeSelector, closeClickOverlay = true) {
            const trigger = document.querySelectorAll(triggerSelector),
                  modal = document.querySelector(modalSelector),
                  close = document.querySelector(closeSelector),
                  windows = document.querySelectorAll('[data-modal]'),
                  scroll = calcScroll();
    
            trigger.forEach(item => {
                item.addEventListener('click', (e) => {
                    if (e.target) {
                        e.preventDefault();
                    }
    
                    windows.forEach(item => {
                        item.style.display = 'none';
                    });
        
                    modal.style.display = 'block';
                    document.body.style.overflow = 'hidden';
                    document.body.style.marginRight = `${scroll}px`;
                    // document.body.classList.add('.modal-open');
                });
            });
    
            close.addEventListener('click', () => {
                windows.forEach(item => {
                    item.style.display = 'none';
                });
    
                modal.style.display = 'none';
                document.body.style.overflow = '';
                document.body.style.marginRight = '0px';
                // document.body.classList.add('.modal-open');
            });
    
            modal.addEventListener('click', (e) => {
                if (e.target === modal && closeClickOverlay) {
                    windows.forEach(item => {
                        item.style.display = 'none';
                    });
                    
                    modal.style.display = 'none';
                    document.body.style.overflow = '';
                    document.body.style.marginRight = '0px';
                    // document.body.classList.add('.modal-open');
                }
            });
        }
    
        function showModalByTime(selector, time) {
            setTimeout(function() {
                document.querySelector(selector).style.display = 'block';
                document.body.style.overflow = 'hidden';
            }, time);
        }
    
        function calcScroll() {
            let div = document.createElement('div');
    
            div.style.width = '50px';
            div.style.height = '50px';
            div.style.overflowY = 'scroll';
            div.style.visibility = 'hidden';
    
            document.body.appendChild(div);
            let scrollWidth = div.offsetWidth - div.clientWidth;
            div.remove();
    
            return scrollWidth;
        }
    
        bindModal('.popup_engineer_btn', '.popup_engineer', '.popup_engineer .popup_close');
        bindModal('.phone_link', '.popup', '.popup .popup_close');
        bindModal('.popup_calc_btn', '.popup_calc', '.popup_calc_close', false);
        bindModal('.popup_calc_button', '.popup_calc_profile', '.popup_calc_profile_close', false);
        bindModal('.popup_calc_profile_button', '.popup_calc_end', '.popup_calc_end_close', false);
        showModalByTime('.popup_60', 60000);
    };

    // TABS
    const tabs = (headerSelector, tabsSelector, contentSelector, activeClass, display = 'block') => {
        const header = document.querySelector(headerSelector),
              tab = document.querySelectorAll(tabsSelector),
              content = document.querySelectorAll(contentSelector);
    
        function hideTabsContent() {
            content.forEach(item => {
                item.style.display = 'none';
            });
    
            tab.forEach(item => {
                item.classList.remove(activeClass);
            });
        }
    
        function showTabsContent(i = 0) {
            content[i].style.display = display;
            tab[i].classList.add(activeClass);
        }
    
        hideTabsContent();
        showTabsContent();
    
        header.addEventListener('click', (e) => {
            const target = e.target;
            if (target && 
                (target.classList.contains(tabsSelector.replace(/\./, "")) || 
                target.parentNode.classList.contains(tabsSelector.replace(/\./, "")))) {
                    tab.forEach((item, i) => {
                        if (target == item || target.parentNode == item) {
                            hideTabsContent();
                            showTabsContent(i);
                        }
                    });
            }
        });
    };

    // TIMER
    const timer = (id, deadline) => {
        const addZero = (num) => {
            if (num <= 9) {
                return '0' + num;
            } else {
                return num;
            }
        };
    
        const getTImeRemaining = (endTime) => {
            const time = Date.parse(endTime) - Date.parse(new Date()),
                  days = Math.floor((time / (1000 * 60 * 60* 24))),
                  hours = Math.floor((time / (1000 * 60 * 60)) % 24),
                  minutes = Math.floor((time / 1000 / 60) % 60),
                  seconds = Math.floor((time / 1000) % 60);
    
            return {
                'total': time,
                'days': days,
                'hours': hours,
                'minutes': minutes,
                'seconds': seconds
            };
        };
    
        const setClock = (selector, endtime) => {
            const timer = document.querySelector(selector),
                 days = timer.querySelector('#days'), 
                 hours = timer.querySelector('#hours'), 
                 minutes = timer.querySelector('#minutes'), 
                 seconds = timer.querySelector('#seconds'),
                 timeInterval = setInterval(updateClock, 1000);
    
    
            updateClock();
    
            function updateClock() {
                const t = getTImeRemaining(endtime);
    
                days.textContent = addZero(t.days);
                hours.textContent = addZero(t.hours);
                minutes.textContent = addZero(t.minutes);
                seconds.textContent = addZero(t.seconds);
    
                if (t.total <= 0) {
                    days.textContent = '00';
                    hours.textContent = '00';
                    minutes.textContent = '00';
                    seconds.textContent = '00';
    
                    clearInterval(timeInterval);
                }
            }
        };
    
        setClock(id, deadline);
    };

    // USING
    let modalState = {};
    let deadline = '2023-06-01';

    modals();
    tabs('.glazing_slider', '.glazing_block', '.glazing_content', 'active');
    tabs('.decoration_slider', '.no_click', '.decoration_content > div > div', 'after_click');
    tabs('.balcon_icons', '.balcon_icons_img', '.big_img > img', 'do_image_more', 'inline-block');
    forms(modalState);
    changeModalState(modalState);
    timer('.container1', deadline);
    images();
});