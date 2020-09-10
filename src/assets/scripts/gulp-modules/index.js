@@include('./libs.js');
document.addEventListener('DOMContentLoaded', () => {
	(function ($) {
		const popupClose = $('.popup__close')
		const overlay = $('.overlay')
		const modalLinks = $('.modal-link')
		const viewSlider = $('.view__slider')
		const header = $('.header')
		const preview = $('.preview')
		const InfrastructureBlock = $('.Infrastructure__info')
		const section = $('section')
		const navbar = $('.navbar')

		navbar.hide()

		let device = navigator.userAgent.toLowerCase();
		let mob = device.match(/android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/);
		if (mob) {
			$(".section").removeClass("section-fixed-bg");
		}

		function mask(inputName, mask, evt) {
			try {
				var text = inputName;
				var value = text.value;
				console.log(text)

				// If user pressed DEL or BACK SPACE, clean the valu
				try {
					var e = evt.which ? evt.which : event.keyCode;
					if (e == 46 || e == 8) {
						text.value = "";
						return;
					}
				} catch (e1) {}

				var literalPattern = /[0\*]/;
				var numberPattern = /[0-9]/;
				var newValue = "";

				for (var vId = 0, mId = 0; mId < mask.length;) {
					if (mId >= value.length) break;

					// Number expected but got a different value, store only the valid portion
					if (mask[mId] == "0" && value[vId].match(numberPattern) == null) {
						break;
					}

					// Found a literal
					while (mask[mId].match(literalPattern) == null) {
						if (value[vId] == mask[mId]) break;

						newValue += mask[mId++];
					}

					newValue += value[vId++];
					mId++;
				}
				text.value = newValue;
			} catch (e) {}
		}

		const phone = document.querySelectorAll('[name="phone"]')

		phone.forEach(item => {
			item.addEventListener('keyup', (e) => {
				mask(item, '+000(00)000-00-00', e)
			})
		})

		$('.paper__link').each(function() {
			$(this).on('click', () => {

			})
		})

		$('.paper__item').each(function() {
			$(this).on('click', (e) => {
				$(this).find('.paper__link')[0].click()
			})
		})

		$(window).on('scroll', (e) => {
			const position = $(this).scrollTop();

			section.each(function () {
				const topPos = $(this).offset().top - 500,
					bottomPos = topPos + $(this).outerHeight()

				if (position >= topPos && position <= bottomPos) {
					$('[data-anchor]').removeClass('navbar__link--active');
					const sectionName = $(this).attr('id')

					if(sectionName === 'main') return

					$('a[href="#' + sectionName + '"]').addClass('navbar__link--active')
				}
			});

			/* SIDEBAR SCROLL COLOR CHANGE */
			let activeSection = $('.navigation__link--active').children('a').attr('href');
		})

		$('[data-anchor]').each(function (_, item) {
			$(this).on('click', (e) => {
				$('html,body').stop().animate({ scrollTop: $(this.hash).offset().top - (header.outerHeight() - 80) }, 1000);
				e.preventDefault()
				navbar.removeClass('navbar--show')
				navbar.fadeOut()
			})
		})

		$('.navbar').on('click', (e) => {
			if(e.target === e.currentTarget) {
				navbar.removeClass('navbar--show')
				navbar.fadeOut()
			}
		})

		$('.burger').on('click', (e) => {
			e.preventDefault()

			navbar.toggleClass('navbar--show')
			navbar.fadeToggle()
		})
		$('.burger-close').on('click', (e) => {
			e.preventDefault()

			navbar.removeClass('navbar--show')
			navbar.fadeOut()
		})

		$('.Infrastructure__btn').on('click', function() {
			$(this).toggleClass('Infrastructure__btn--hide')
			InfrastructureBlock.toggleClass('Infrastructure__info--hide')
		})

		if(document.documentElement.clientWidth <= 670) {
			$('.main__block').append($('.main__socials'))
			$('.main__right').append($('.main__block'))
			$('.main__right-bg').css('width', document.documentElement.clientWidth - 50)
		}

		function showBigImgInOverlay(e, isGallery = false, srcIsData = false) {
			closeAllOverlay()
			overlay.addClass('overlay--show')

			if(isGallery) {
				preview.addClass('preview--show-gallery')
			} else {
				preview.addClass('preview--show')
			}
			
			let src

			if(srcIsData) {
				src = e.target.parentNode.dataset.viewImg
			} else {
				src = e.target.getAttribute('src')
			}

			preview.find('img').attr('src', src)
		}

		$('.gallery__content').on('click', (e) => {
			if(e.target.tagName === 'IMG') {
				showBigImgInOverlay(e, true)
			}
		})
	
		viewSlider.on('click', (e) => {
			if(e.target.tagName === 'IMG') {
				showBigImgInOverlay(e, false, true)
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
			preview.removeClass('preview--show-gallery')
		})
	
		$(document).on('click', '.submit__form', (e) => {
			const $form = $(e.target.closest('[data-popup]'))
				e.preventDefault()
				const inputs = $form.find($('.popup__input'))
				const isValid = validateForm(inputs, $form)
				
				if(isValid) {
					sendAjaxForm('static/mail.php', $form)
				}
		})
	
		function validateForm(inputs, $form) {
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

			if($form.data('form') !== 'popup') {
				$('.form__warn').css('color', '#fff')
			}
	
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

					if($(selectorForm).data('form') !== 'popup') {
						$('.form__status').css('color', '#fff')
					}

					removeNodeByDelay(msg, 5000)
					$(selectorForm)[0].reset()
				},
				error: function(response) { // Данные не отправлены
					$(selectorForm).append(`<div class="form__status">${status.error}</div>`);
					const msg = $(selectorForm).find('.form__status')

					if($(selectorForm).data('form') !== 'popup') {
						$('.form__status').css('color', '#fff')
					}

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
			$('.gallery__item.slick-cloned').css('height', slick.$slideTrack.height() + 'px');
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
		const markers = [
			{
				position: {lat: 50.407538, lng: 30.672460},
				map: map,
				icon: 'assets/images/cli/Metropolia.svg'
			},
			{
				position: {lat: 50.403393, lng: 30.665952},
				map: map,
				icon: 'assets/images/cli/metro.svg'
			},
			{
				position: {lat: 50.403586, lng: 30.682905},
				map: map,
				icon: 'assets/images/cli/metro.svg'
			},
			{
				position: {lat: 50.407214, lng: 0.666297},
				map: map,
				icon: 'assets/images/cli/shop.svg'
			},
			{
				position: {lat: 50.405827, lng: 30.660882},
				map: map,
				icon: 'assets/images/cli/school.svg'
			},
			{
				position: {lat: 50.406310, lng: 30.656472},
				map: map,
				icon: 'assets/images/cli/restaraunt.svg'
			},
			{
				position: {lat: 50.414023, lng: 30.662040},
				map: map,
				icon: 'assets/images/cli/shop.svg'
			},
			{
				position: {lat: 50.405053, lng: 30.612423},
				map: map,
				icon: 'assets/images/cli/mall.svg'
			},
			{
				position: {lat: 50.416862, lng: 30.668133},
				map: map,
				icon: 'assets/images/cli/park.svg'
			},
			{
				position: {lat: 50.407102,  lng: 30.666597},
				map: map,
				icon: 'assets/images/cli/marker-bank.svg'
			},
			{
				position: {lat: 50.407102,  lng: 30.666597},
				map: map,
				icon: 'assets/images/cli/marker-post.svg'
			},
			{
				position: {lat: 50.406298,   lng: 30.658947},
				map: map,
				icon: 'assets/images/cli/school.svg'
			},
			{
				position: {lat: 50.409536,    lng: 30.672414},
				map: map,
				icon: 'assets/images/cli/marker-veterenary.svg'
			},
			{
				position: {lat: 50.415035,     lng: 30.664089},
				map: map,
				icon: 'assets/images/cli/pharmacy.svg'
			},
			{
				position: {lat: 50.411749,      lng: 30.655619},
				map: map,
				icon: 'assets/images/cli/pharmacy.svg'
			},
			{
				position: {lat: 50.411749,      lng: 30.655619},
				map: map,
				icon: 'assets/images/cli/marker-hypermarker.svg'
			},
			{
				position: {lat: 50.390180,       lng: 30.635083},
				map: map,
				icon: 'assets/images/cli/marker-hypermarker.svg'
			},
		]
	
		map = new google.maps.Map(document.querySelector('.Infrastructure__map'), {
			center: {lat: 50.407538, lng: 30.672460},
			disableDefaultUI: true,
			zoom: 15,
			styles: [
				{
					"featureType": "all",
					"elementType": "labels.text.fill",
					"stylers": [
						{
							"saturation": 36
						},
						{
							"color": "#000000"
						},
						{
							"lightness": 40
						}
					]
				},
				{
					"featureType": "all",
					"elementType": "labels.text.stroke",
					"stylers": [
						{
							"visibility": "on"
						},
						{
							"color": "#000000"
						},
						{
							"lightness": 16
						}
					]
				},
				{
					"featureType": "all",
					"elementType": "labels.icon",
					"stylers": [
						{
							"visibility": "off"
						}
					]
				},
				{
					"featureType": "administrative",
					"elementType": "geometry.fill",
					"stylers": [
						{
							"lightness": 20
						},
						{
							"color": "#000000"
						}
					]
				},
				{
					"featureType": "administrative",
					"elementType": "geometry.stroke",
					"stylers": [
						{
							"color": "#000000"
						},
						{
							"lightness": 17
						},
						{
							"weight": 1.2
						}
					]
				},
				{
					"featureType": "administrative.country",
					"elementType": "labels.text.fill",
					"stylers": [
						{
							"visibility": "on"
						},
						{
							"color": "#ffffff"
						}
					]
				},
				{
					"featureType": "administrative.province",
					"elementType": "geometry.fill",
					"stylers": [
						{
							"visibility": "simplified"
						}
					]
				},
				{
					"featureType": "administrative.province",
					"elementType": "labels.text.fill",
					"stylers": [
						{
							"color": "#ffffff"
						}
					]
				},
				{
					"featureType": "administrative.province",
					"elementType": "labels.text.stroke",
					"stylers": [
						{
							"weight": "0.01"
						},
						{
							"invert_lightness": true
						},
						{
							"color": "#f26c4f"
						}
					]
				},
				{
					"featureType": "landscape",
					"elementType": "geometry",
					"stylers": [
						{
							"color": "#000000"
						},
						{
							"lightness": 20
						}
					]
				},
				{
					"featureType": "poi",
					"elementType": "geometry",
					"stylers": [
						{
							"color": "#000000"
						},
						{
							"lightness": 21
						}
					]
				},
				{
					"featureType": "road.highway",
					"elementType": "geometry.fill",
					"stylers": [
						{
							"visibility": "simplified"
						},
						{
							"weight": "0.05"
						},
						{
							"color": "#ffffff"
						},
						{
							"lightness": 17
						}
					]
				},
				{
					"featureType": "road.highway",
					"elementType": "geometry.stroke",
					"stylers": [
						{
							"color": "#f26c4f"
						},
						{
							"weight": "0.10"
						},
						{
							"invert_lightness": true
						},
						{
							"lightness": 29
						}
					]
				},
				{
					"featureType": "road.highway",
					"elementType": "labels.text.fill",
					"stylers": [
						{
							"color": "#f26c4f"
						}
					]
				},
				{
					"featureType": "road.highway.controlled_access",
					"elementType": "geometry",
					"stylers": [
						{
							"weight": "0.30"
						}
					]
				},
				{
					"featureType": "road.arterial",
					"elementType": "geometry",
					"stylers": [
						{
							"color": "#000000"
						},
						{
							"lightness": 18
						}
					]
				},
				{
					"featureType": "road.local",
					"elementType": "geometry",
					"stylers": [
						{
							"color": "#000000"
						},
						{
							"lightness": 16
						}
					]
				},
				{
					"featureType": "transit",
					"elementType": "geometry",
					"stylers": [
						{
							"color": "#000000"
						},
						{
							"lightness": 19
						}
					]
				},
				{
					"featureType": "water",
					"elementType": "geometry",
					"stylers": [
						{
							"color": "#000000"
						},
						{
							"lightness": 17
						}
					]
				}
			]
		})

		markers.forEach(item => {
			const marker = new google.maps.Marker(item)
			marker.setMap(map)
		})
	
	
	})(jQuery);
})