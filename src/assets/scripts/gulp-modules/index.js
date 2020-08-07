@@include('./libs.js');
document.addEventListener('DOMContentLoaded', () => {
	(function ($) {
		const popupClose = $('.popup__close')
		const overlay = $('.overlay')
		const modalLinks = $('.modal-link')
		const viewSlider = $('.view__slider')
		const preview = $('.preview')
		const InfrastructureBlock = $('.Infrastructure__info')

		$('.Infrastructure__btn').on('click', function() {
			$(this).toggleClass('Infrastructure__btn--hide')
			InfrastructureBlock.toggleClass('Infrastructure__info--hide')

		})

		if(document.documentElement.clientWidth <= 670) {
			$('.main__block').append($('.main__socials'))
			$('.main__right').append($('.main__block'))
			$('.main__right-bg').css('width', document.documentElement.clientWidth - 50)
		}
	
		viewSlider.on('click', (e) => {
			if(e.target.tagName === 'IMG') {
				closeAllOverlay()
				overlay.addClass('overlay--show')
				preview.addClass('preview--show')
				const src = e.target.getAttribute('src')
	
				preview.find('img').attr('src', src)
			}
		})
	
		function closeAllOverlay() {
			$('.popup').each(function() {
				$(this).hide()
			})
		}
	
		modalLinks.each(function() {
			$(this).on('click', (e) => {
				e.preventDefault()
				overlay.addClass('overlay--show fadeIn')
				overlay.find('.popup__callback').css('display', 'block')
			})
		})
	
		popupClose.on('click', (e) => {
			e.preventDefault()
			overlay.removeClass('overlay--show fadeIn')
			overlay.find('.popup__callback').css('display', 'none')
			preview.removeClass('preview--show')
		})
	
		$(document).on('click', '.submit__form', (e) => {
			const $form = $(e.target.closest('[data-popup]'))
				e.preventDefault()
				const inputs = $form.find($('.popup__input'))
				const isValid = validateForm(inputs)
				
				if(isValid) {
					sendAjaxForm('static/mail.php', $form)
				}
		})
	
		function validateForm(inputs) {
			let isValid = true
			inputs.each(function() {
				$(this).on('input', (e) => {
					if($(e.target).val().replace(/\s+/g, '')) {
						removeFormTextWarn($(this))
						isValid = false
						return
					} else {
						removeFormTextWarn($(this))
						$(this).closest('.popup__block').append('<div class="form__warn">Это поле обязательное</div>')
						isValid = false
						return
					}
				})
	
				if(!$(this).val().replace(/\s+/g, '')) {
					removeFormTextWarn($(this))
					$(this).closest('.popup__block').append('<div class="form__warn">Это поле обязательное</div>')
					isValid = false
				}
			})
	
			return isValid
		}
	
		function sendAjaxForm(url, selectorForm) {
	
			const status = {
				sucess: 'Спасибо за заявку мы с вами свяжемся в ближайшее время',
				error: 'Ошибка на сервере повторите попытку позже'
			}
	
			$.ajax({
				url:     url, //url страницы (action_ajax_form.php)
				type:     "POST", //метод отправки
				dataType: "html", //формат данных
				data: $(selectorForm).serialize(),  // Сеарилизуем объект
				success: function(response) { //Данные отправлены успешно
					$(selectorForm).append(`<div class="form__status">${status.sucess}</div>`)
					const msg = $(selectorForm).find('.form__status')
					removeNodeByDelay(msg, 5000)
					$(selectorForm)[0].reset()
				},
				error: function(response) { // Данные не отправлены
					$(selectorForm).append(`<div class="form__status">${status.error}</div>`);
					const msg = $(selectorForm).find('.form__status')
	
					removeNodeByDelay(msg, 5000)
					$(selectorForm)[0].reset()
				}
			 });
		}
	
		function removeFormTextWarn(input) {
			input.closest('.popup__block').find('.form__warn').remove()
		}
		
		function removeNodeByDelay(node, delay) {
			setTimeout(() => {
				node.remove()
			}, delay)
		}
	
		$('.gallery__wrap').slick({
			arrows: false,
			slidesToShow: 3,
			slidesToScroll: 1,
			centerMode: true,
			centerPadding: '40px',
		}).on('setPosition', function (event, slick) {
			slick.$slides.css('height', slick.$slideTrack.height() + 'px');
		});

		$('.view__slider').on('init afterChange', (_, slick, currentSlide = 0) => {
			$('.view__top-current').text(`№ ${currentSlide + 1}`)
			$('.view__top-total').text(slick.$slides.length)
		})
	
		$('.view__slider').slick({
			arrows: false,
			slidesToShow: 4,
			slidesToScroll: 1,
			responsive: [
				{
				  breakpoint: 1360,
				  settings: {
					slidesToShow: 3
				  }
				},
				{
					breakpoint: 1024,
					settings: {
					  slidesToShow: 2
					}
				},
				{
				breakpoint: 650,
				settings: {
					slidesToShow: 1
				}
				},
			]
		})


		$('.paper__slider').slick({
			arrows: false,
			slidesToShow: 4,
			slidesToScroll: 1,
			responsive: [
				{
				  breakpoint: 1300,
				  settings: {
					slidesToShow: 3
				  }
				},
				{
					breakpoint: 880,
					settings: {
					  slidesToShow: 2
					}
				},
				  {
					breakpoint: 600,
					settings: {
					  slidesToShow: 1
					}
				},
			]
		}).slick('setPosition')
		$('.view__btn--prev').click(function() {
			$('.view__slider').slick('slickPrev')
		})
	
		$('.view__btn--next').click(function() {
			$('.view__slider').slick('slickNext')
		})
	
		$('.slider-control__btn--prev').click(function() {
			$('.gallery__wrap').slick('slickPrev')
		})
	
		$('.slider-control__btn--next').click(function() {
			$('.gallery__wrap').slick('slickNext')
		})

		$('.paper__btn--prev').click(function() {
			$('.paper__slider').slick('slickPrev')
		})

		$('.paper__btn--next').click(function() {
			$('.paper__slider').slick('slickNext')
		})
	
		let map 
	
		map = new google.maps.Map(document.querySelector('.Infrastructure__map'), {
			center: {lat: 50.5439445, lng: 30.2167314},
			zoom: 13,
		})
	
	
	})(jQuery);
})