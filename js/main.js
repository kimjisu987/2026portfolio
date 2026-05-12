// ⏰ 헤더 시간 표시
function koreanTime() {
	const options = { timeZone: 'Asia/Seoul' };
	const date = new Date();
	const weekday = new Intl.DateTimeFormat('en-US', { weekday: 'short', ...options }).format(date);
	const day = new Intl.DateTimeFormat('en-US', { day: 'numeric', ...options }).format(date);
	const month = new Intl.DateTimeFormat('en-US', { month: 'short', ...options }).format(date);
	const time = new Intl.DateTimeFormat('en-US', {
		hour: 'numeric',
		minute: '2-digit',
		hour12: true,
		...options
	}).format(date);
	return `${weekday} ${day} ${month} ${time}`;
}
function updateTime() {
	$('.header-right .time').text(koreanTime());
}

// 📂 네비게이션 메뉴 토글
function headerList() {
	const $depth1 = $('.nav .depth1');
	const $navList = $('.nav .nav-list');

	$depth1.children('a').on('click', function (e) {
		e.stopPropagation();
		const $current = $(this).closest('.depth1');

		if ($current.hasClass('on')) {
			$depth1.removeClass('on');
			$navList.fadeOut(200);
		} else {
			$depth1.removeClass('on');
			$current.addClass('on');
			$navList.hide();
			$(this).next().fadeIn(200);
		}
	});
}

// ✋ 외부 클릭 시 닫기
function closeBack(selector, duration = 200, callback = null) {
	$(document).on('click', function (e) {
		if (!$(e.target).closest(selector).length && !$(e.target).is(selector)) {
			$(selector).fadeOut(duration, function () {
				if (typeof callback === 'function') callback();
			});
		}
	});
}

// 📁 폴더 우클릭 메뉴
function folderContextMenu() {
	$('.mainBack .sub-list').hide();

	$(document).on('mousedown', '.mainBack .depth1 .folder-cnt', function (e) {
		if (e.button !== 2) return;

		e.preventDefault();
		const targetClass = $(this).data('target');
		const menu = `
		<ul class="sub-list">
			<li class="depth2"><a href="#" data-target="${targetClass}">Open</a></li>
		</ul>`;

		$('.mainBack .sub-list').hide();
		const $menu = $(menu).hide();
		$(this).after($menu);
		$menu.fadeIn(200);

		openFolder(); // 다시 바인딩

		$(document).on('click', '.mainBack .sub-list a', function (e) {
			e.preventDefault();
			$('.mainBack .sub-list').fadeOut(200, function () {
				$(this).remove();
			});
		});
	});
}

// 📁 폴더 더블클릭 열기 및 우클릭 메뉴 열기
function openFolder() {
	function activateFolder(target) {
		const $mainFolder = $('.drag-folder.main');

		$mainFolder.fadeIn();
		$mainFolder.find('[data-list]').removeClass('active');
		$mainFolder.find(`[data-list="${target}"]`).addClass('active');

		$mainFolder.find('.body-main').hide().removeClass('on');
		$mainFolder.find(`.body-main[data-folder="${target}"]`).css('display', 'flex').addClass('on');

		$(".drag-folder").css("z-index", "1");
		$mainFolder.css("z-index", "9");

		folderTitle();
		folderBack();
	}

	$('.mainBack').on('dblclick', '.folder-cnt[data-target]', function (e) {
		e.preventDefault();
		activateFolder($(this).data('target'));
	});

	$('.mainBack').on('click', '.sub-list a[data-target]', function (e) {
		e.preventDefault();
		activateFolder($(this).data('target'));
	});
}

// 📁 폴더 타이틀 설정
function folderTitle() {
	const $active = $('.drag-folder.main').find('[data-list].active');
	const $mainFolder = $('.drag-folder.main');

	if (!$active.length) {
		$mainFolder.find(".folder-body .txt-wrap .tit").text("");
		$mainFolder.find(".body-main").show(200);
	} else {
		const name = $active.find('p.name').text().trim();
		const folder = $active.data('list');

		$mainFolder.find(".folder-body .txt-wrap .tit").text(name);
		$mainFolder.find(".body-main").hide().removeClass('on');
		$mainFolder.find(`.body-main[data-folder="${folder}"]`).css('display', 'flex').addClass('on');
	}

	$(".folder-prev").toggleClass('disabled', !$mainFolder.find(".body-main.on").hasClass('open'));
}

// 📁 하위 폴더 열기
function openFolder2() {
	$('.body-main').on('dblclick', '.depth2 .folder-cnt:not(.none)', function (e) {
		e.preventDefault();
		const $cnt = $(this);
		const $main = $cnt.closest('.body-main');
		const target = $cnt.data('target');

		const isOpen = $cnt.hasClass('on');
		$main.find('.folder-cnt').removeClass('on');
		$main.find('.depth3').hide();

		if (!isOpen) {
			$cnt.addClass('on');
			$main.find(`[data-depth="${target}"]`).show();
			$main.addClass('open');
			$('.folder-prev').removeClass('disabled');
		} else {
			$main.removeClass('open');
			$('.folder-prev').addClass('disabled');
		}

		folderBack();
	});
}
const winW = window.innerWidth || document.documentElement.clientWidth;
// 📁 창 확대
function zoomFolder() {
	$('.zoomFolder').on('click', function () {
		const $folder = $(this).closest('[class*=drag-folder]');
		$folder.find('.folder-body').css('width', '100%');
		$folder.find('.folder-header .header-list').css('max-height', '100%');

		if (winW <= 768) {
			$folder.css({ width: '90vw', height: '90vh', top: '2vw', left: '2vh' });
		} else if (winW <= 1240) {
			$folder.css({ width: '85vw', height: '85vh', top: '3vw', left: '3vh' });
		} else {
			$folder.css({ width: '80vw', height: '80vh', top: '5vw', left: '5vh' });
		}
	});
}

// 📁 창 축소
function miniFolder() {
	$('.miniFolder').on('click', function () {
		const $folder = $(this).closest('[class*=drag-folder]');
		$folder.find('.folder-body').css('width', '100%');

		if (winW <= 768) {
			$folder.css({ width: '70vw', height: 'auto', top: '2vw', left: '2vh' });
			$folder.find('.folder-header .header-list').css('max-height', '70vh');
		} else if (winW <= 1240) {
			$folder.css({ width: '60vw', height: 'auto', top: '3vw', left: '3vh' });
			$folder.find('.folder-header .header-list').css('max-height', '70vh');
		} else {
			$folder.css({ width: '50vw', height: 'auto', top: '5vw', left: '5vh' });
			$folder.find('.folder-header .header-list').css('max-height', '70vh');
		}
	});
}

// 📁 폴더 닫기
function closeFolder() {
	$('.closeFolder').on('click', function () {
		$(this).closest('[class*=drag-folder]').fadeOut(200);
	});
}

// 📁 폴더 리스트 클릭 시 열기
$(document).on('click', '.list-type.folder a[data-list]', function (e) {
	e.preventDefault();
	$('[data-list]').removeClass('active');
	$(this).addClass('active');
	folderTitle();
	folderBack();
});

// 📁 폴더 리스트 동기화
function updateList() {
	const folderData = $('.mainBack .folder-name').map(function () {
		const $folder = $(this).closest('.folder-cnt');
		return { name: $(this).text().trim(), target: $folder.data('target') };
	}).get();

	const $folderList = $('.drag-folder.main .header-list .list-type.folder .folder-list').empty();

	folderData.forEach(item => {
		$folderList.append(`
      <li>
        <a href="#" data-list="${item.target}">
          <i class="ri-folder-6-line"></i>
          <p class="name">${item.name}</p>
        </a>
      </li>
    `);
	});
}

// 📁 폴더 뒤로가기
function folderBack() {
	$('.folder-prev').on('click', function (e) {
		e.preventDefault();
		const $activeMain = $('.body-main.on');
		$activeMain.find('.folder-cnt').removeClass('on');
		$activeMain.find('.depth3').hide();
		$activeMain.removeClass('open');
		$('.folder-prev').addClass('disabled');
	});
}

// ⛔ 우클릭 막기
$(document).on('contextmenu', 'body', function (e) {
	e.preventDefault();
});

// 재직기간 계산
$(function () {
	$('.graph-wrap .com_time').each(function () {

		const startText = $(this).children('.start').text().trim();
		const endText = $(this).children('.end').text().trim();

		const startArr = startText.split('.');
		const startYear = parseInt(startArr[0], 10);
		const startMonth = parseInt(startArr[1], 10);

		let endYear, endMonth;

		// 재직중
		if (endText === '재직중') {
			const now = new Date();
			endYear = now.getFullYear();
			endMonth = now.getMonth() + 1;
		} else {
			const endArr = endText.split('.');
			endYear = parseInt(endArr[0], 10);
			endMonth = parseInt(endArr[1], 10);
		}

		const totalMonths = (endYear - startYear) * 12 + (endMonth - startMonth) + 1;
		const years = Math.floor(totalMonths / 12);
		const months = totalMonths % 12;

		let result = '';

		if (years > 0) { result += years + '년 '; }
		if (months > 0) { result += months + '개월'; }
		if (months == 0) { result = years + '년'; }

		$(this).children('.com_tag').text(result);
	});
});

// 토글 박스
$(function () {
	$(".toggle-box").hide();
	$(".toggle-box.open").show();
	$(document).on("click", ".toggle-title", function () {
		$(this).next(".toggle-box").slideToggle();
		$(this).toggleClass("open");
		$(this).next(".toggle-box").toggleClass("open");
	})
});

// ✅ 초기 실행
$(function () {
	updateTime();
	setInterval(updateTime, 1000);

	openFolder();
	openFolder2();
	closeFolder();
	zoomFolder();
	miniFolder();
	folderTitle();
	folderBack();
	headerList();
	updateList();
	folderContextMenu();
	dblclick();
	zIndex();
	zoomInOut();
	skillBar();
	zoomImg();

	// 드래그 설정
	$("[class*=drag-folder]").draggable({
		start: function () {
			$("[class*=drag-folder]").css("z-index", 1);
			$(this).css("z-index", 9);
		},
		stop: function () {
		},
		cancel: 'a, input, label, button, p, h1, h2, h3, h4, h5, h6, dl, ul'
	});

	closeBack('.nav .nav-list', 200, () => $('.nav .depth1').removeClass('on'));
	closeBack('.mainBack .sub-list', 200, function () { $(this).remove(); });
});

// 📄 더블클릭 이벤트
function dblclick() {
	$('.depth2 [class*=ico]:not(.icon-fol)').on('dblclick', function (e) {
		e.preventDefault();
		let folderData = $(this).data('app');
		let titleName = $(this).find(".folder-name").text().trim();

		$(`.drag-folder[data-app="${folderData}"]`).fadeIn();
		$(".drag-folder").css("z-index", "1");
		$(`.drag-folder[data-app="${folderData}"]`).css("z-index", "9");
		$(`.drag-folder[data-app="${folderData}"]`).find(".txt-wrap .tit").text(titleName);
	});

	$('.depth3 [class*=ico]:not(.icon-fol)').on('dblclick', function (e) {
		e.preventDefault();
		let folderData = $(this).data('app');
		let depthName = $(this).closest(".depth3").data("depth");
		let titleName = $(`.folder-cnt[data-target="${depthName}"]`).find(".folder-name").text().trim();

		$(`.drag-folder[data-app="${folderData}"]`).fadeIn();
		$(".drag-folder").css("z-index", "1");
		$(`.drag-folder[data-app="${folderData}"]`).css("z-index", "9");
		$(`.drag-folder[data-app="${folderData}"]`).find(".txt-wrap .tit").text(titleName);
	});
}

// a태그 이동 : 더블클릭 변경
$(function () {
	let clickTimer = null;

	$(".dbl-link").on("click", function (e) {
		e.preventDefault();
		const $this = $(this);
		$this.focus();

		if (clickTimer) {
			clearTimeout(clickTimer);
			clickTimer = null;

			const url = $this.data("url");
			window.open(url, "_blank");

			return;
		}

		clickTimer = setTimeout(function () {
			clickTimer = null;
		}, 250);
	});
});

// 📁 Contact 이벤트 닫기
$(function () {
	$('.drag-folder[data-app="contacts-profile"] .close_btn').on('click', function () {
		$(this).closest(".event").slideUp(200);
	});
})

// 폴더 Z-index 정렬
function zIndex() {
	$('.drag-folder').on('mousedown', function () {
		$(".drag-folder").css("z-index", "1");
		$(this).css("z-index", "9");
	});
}

// 🎯 나이 계산
function getAge(birthDateStr) {
	const today = new Date();
	const birthDate = new Date(birthDateStr);

	let age = today.getFullYear() - birthDate.getFullYear();
	const isBeforeBirthday =
		today.getMonth() < birthDate.getMonth() ||
		(today.getMonth() === birthDate.getMonth() && today.getDate() < birthDate.getDate());

	if (isBeforeBirthday) {
		age--;
	}

	return age;
}
$(function () {
	const birth = '1991-10-29';
	const age = getAge(birth);
	$('.drag-folder[data-app="contacts-profile"] .body-top .txt_box .date').text(`만 ${age}세 (생년월일: ${birth.replace(/-/g, '.')})`);
});

// 🔎Zoom in out
function zoomInOut() {
	$('.drag-folder .zoom-in').on('click', function () {
		const $body = $(this).closest('.drag-folder').find('.folder-body');
		let currentZoom = parseFloat($body.css('zoom')) || 1;
		currentZoom = Math.min(currentZoom + 0.1, 1.5);
		$body.css('zoom', currentZoom.toFixed(2));
	});

	$('.drag-folder .zoom-out').on('click', function () {
		const $body = $(this).closest('.drag-folder').find('.folder-body');
		let currentZoom = parseFloat($body.css('zoom')) || 1;
		currentZoom = Math.max(currentZoom - 0.1, 1);
		$body.css('zoom', currentZoom.toFixed(2));
	});
}

// 📁skill 프로그래스바
function skillBar() {
	$('.skill_bar').each(function () {
		const skill = $(this).data('skill');
		$(this).find('.bar-fill').css('width', skill);
	});
}

// 💬Alert
// modal_confirm / modal_ok / modal_error
function alert_modal(alert_style, alert_title, alert_msg, callback) {
	let btnArr = ['확인', '확인'];
	if (alert_style == 'modal_confirm') {
		btnArr[0] = '닫기';
	}

	let modalHtml = ``;
	modalHtml += `<div class="alert ${alert_style}">`
	modalHtml += `    <div class="icon_box"></div>`
	modalHtml += `    <div class="txt_box">`
	modalHtml += `        <h3 class="tit">${alert_title}</h3>`
	modalHtml += `        <p class="txt">${alert_msg}</p>`
	modalHtml += `    </div>`
	modalHtml += `    <div class="btn_box">`
	modalHtml += `        <button type="button" class="modal_btn">${btnArr[0]}</button>`
	modalHtml += `        <button type="button" class="modal_btn">${btnArr[1]}</button>`
	modalHtml += `    </div>`
	modalHtml += `</div>`

	const modal = $(modalHtml);

	$('body').append(modal.hide().fadeIn(200, function () { $(this).addClass('on'); }));

	// 버튼 클릭 시 모달 확인
	modal.find('.modal_btn:last-of-type').on('click', function () {
		alert_close(callback);
	});

	// 버튼 클릭 시 모달 취소 - 컨펌창에서만 사용
	modal.find('.modal_btn:first-of-type').on('click', function () {
		alert_close();
	});
}
function alert_close(callback) {
	$('.alert').removeClass('on').fadeOut(200, function () {
		$(this).remove();
		if (typeof callback == "function") {
			callback();
		}
	});
}

// 💬Alert 실행
$(function () {
	$(document).on('dblclick', 'a[data-app="alert-jecheon1"]', function (e) {
		e.preventDefault();
		alert_modal('modal_confirm', '프로젝트 리뉴얼', '프로젝트가 리뉴얼된 관계로 포트폴리오에 첨부된 1차 결과물과 현재 화면이 상이할 수 있습니다.<br>[확인]을 누르시면 리뉴얼된 페이지로 이동됩니다.',
			function () {
				window.open('https://farmup-jc.kr/', '_blank');
			}
		);
	});
	$(document).on('dblclick', 'a[data-app="alert-jejudog1"]', function (e) {
		e.preventDefault();
		alert_modal('modal_confirm', '프로젝트 알림', '빠른 로그인을 원하시는 경우 아래 이메일 계정으로 로그인하실 수 있습니다.<br><br>ID: jejudog@naver.com<br>Password: wpwnehr1!<br><br>[확인]을 누르시면 리뉴얼된 페이지로 이동합니다.',
			function () {
				window.open('http://kimjisu.dothome.co.kr/jejudog/', '_blank');
			}
		);
	});
	$(document).on('dblclick', 'a[data-app="alert-daegu1"]', function (e) {
		e.preventDefault();
		alert_modal('modal_ok', '프로젝트 미배포', '프로젝트가 일시 중단되어 현재 웹사이트를 이용하실 수 없습니다.', '');
	});
	$(document).on('dblclick', 'a[data-app="alert-dga1"]', function (e) {
		e.preventDefault();
		alert_modal('modal_ok', '프로젝트 미배포', '프로젝트가 일시 중단되어 현재 웹사이트를 이용하실 수 없습니다.', '');
	});
	$(document).on('dblclick', 'a[data-app="alert-dongne1"]', function (e) {
		e.preventDefault();
		alert_modal('modal_ok', '프로젝트 리뉴얼', '프로젝트 리뉴얼로 현재 웹사이트 화면과 상이하여 링크 연결이 불가합니다.', '');
	});
	$(document).on('dblclick', 'a[data-app="alert-modong1"]', function (e) {
		e.preventDefault();
		alert_modal('modal_ok', '프로젝트 리뉴얼', '프로젝트 리뉴얼 준비중입니다.', '');
	});
	$(document).on('dblclick', 'a[data-app="alert-krc2"]', function (e) {
		e.preventDefault();
		alert_modal('modal_ok', '보안 제한', '내부 보안 정책으로 인해 코드를 외부에 공유할 수 없습니다.', '');
	});
	$(document).on('dblclick', 'a[data-app="alert-jecheon2"]', function (e) {
		e.preventDefault();
		alert_modal('modal_ok', '보안 제한', '내부 보안 정책으로 인해 코드를 외부에 공유할 수 없습니다.', '');
	});
	$(document).on('dblclick', 'a[data-app="alert-daegu2"]', function (e) {
		e.preventDefault();
		alert_modal('modal_ok', '보안 제한', '내부 보안 정책으로 인해 코드를 외부에 공유할 수 없습니다.', '');
	});
	$(document).on('dblclick', 'a[data-app="alert-dga2"]', function (e) {
		e.preventDefault();
		alert_modal('modal_ok', '보안 제한', '내부 보안 정책으로 인해 코드를 외부에 공유할 수 없습니다.', '');
	});
	$(document).on('dblclick', 'a[data-app="alert-dongne2"]', function (e) {
		e.preventDefault();
		alert_modal('modal_ok', '보안 제한', '내부 보안 정책으로 인해 코드를 외부에 공유할 수 없습니다.', '');
	});
	$(document).on('dblclick', 'a[data-app="alert-cer-design6"]', function (e) {
		e.preventDefault();
		alert_modal('modal_ok', '웹디자인기능사', '취득월 : 2024. 09<br>발행처 : 한국산업인력공단', '');
	});
	$(document).on('dblclick', 'a[data-app="alert-cer-design5"]', function (e) {
		e.preventDefault();
		alert_modal('modal_ok', '전자출판기능사', '취득월 : 2024. 09<br>발행처 : 한국산업인력공단', '');
	});
	$(document).on('dblclick', 'a[data-app="alert-cer-design4"]', function (e) {
		e.preventDefault();
		alert_modal('modal_ok', '컴퓨터그래픽스운용기능사', '취득월 : 2021. 07<br>발행처 : 한국산업인력공단', '');
	});
	$(document).on('dblclick', 'a[data-app="alert-cer-design3"]', function (e) {
		e.preventDefault();
		alert_modal('modal_ok', 'GTQid(그래픽기술자격 인디자인) 1급', '취득월 : 2021. 06<br>발행처 : 한국생산성본부', '');
	});
	$(document).on('dblclick', 'a[data-app="alert-cer-design2"]', function (e) {
		e.preventDefault();
		alert_modal('modal_ok', 'GTQi(그래픽기술자격 일러스트) 1급', '취득월 : 2021. 03<br>발행처 : 한국생산성본부', '');
	});
	$(document).on('dblclick', 'a[data-app="alert-cer-design1"]', function (e) {
		e.preventDefault();
		alert_modal('modal_ok', 'GTQ(그래픽기술자격 포토샵) 1급', '취득월 : 2021. 03<br>발행처 : 한국생산성본부', '');
	});
	$(document).on('dblclick', 'a[data-app="alert-cer-oa4"]', function (e) {
		e.preventDefault();
		alert_modal('modal_ok', '정보기술자격(ITQ) 아래한글 A등급', '취득월 : 2021. 12<br>발행처 : 한국생산성본부', '');
	});
	$(document).on('dblclick', 'a[data-app="alert-cer-oa3"]', function (e) {
		e.preventDefault();
		alert_modal('modal_ok', '정보기술자격(ITQ) 인터넷 A등급', '취득월 : 2021. 12<br>발행처 : 한국생산성본부', '');
	});
	$(document).on('dblclick', 'a[data-app="alert-cer-oa2"]', function (e) {
		e.preventDefault();
		alert_modal('modal_ok', '정보기술자격(ITQ) 한글엑셀(한셀) A등급', '취득월 : 2021. 12<br>발행처 : 한국생산성본부', '');
	});
	$(document).on('dblclick', 'a[data-app="alert-cer-oa1"]', function (e) {
		e.preventDefault();
		alert_modal('modal_ok', '정보기술자격(ITQ) 한글파워포인트 A등급', '취득월 : 2007. 09<br>발행처 : 한국생산성본부', '');
	});
	$(document).on('dblclick', 'a[data-app="alert-cer-etc2"]', function (e) {
		e.preventDefault();
		alert_modal('modal_ok', 'TESAT 2등급', '취득월 : 2024. 06<br>발행처 : 한국경제신문', '');
	});
	$(document).on('dblclick', 'a[data-app="alert-cer-etc1"]', function (e) {
		e.preventDefault();
		alert_modal('modal_ok', '자동차운전면허증 2종보통', '취득월 : 2020. 11<br>발행처 : 서울지방경찰청', '');
	});
});

var check = false;
/** 이미지 확대보기 **/
function zoomImg() {
	var zwObj = $('.zoom-img');

	zwObj.each(function () {
		var this_s = $(this);
		var zwObjImg = this_s.children("img");
		var zwObjUrl = zwObjImg.attr("src");

		if (check == false) {
			this_s.append("<a href='" + zwObjUrl + "' class='btn-zoom' target='_blank' title='새창열림'><i class='ri-zoom-in-line'></i><span class='hid'>이미지 확대보기</span></a>");
			zwObjImg.addClass("zoom");
		}
	});
	check = true;
}
$(window).on('resize', function () {
	zoomImg();
});

$(document).on("click", "header .sub-list .depth2 > a", function(e) {
	e.preventDefault();
    $("a[data-app='contacts-profile']").trigger("dblclick");
	$(this).closest(".sub-list").fadeOut();
});