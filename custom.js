/* 스와이퍼 */

let swiper = null;


/* Swiper 생성 */
function makeSwiper() {

    swiper = new Swiper(".swiper", {

        slidesPerView: 1.6,
        centeredSlides: false,
        spaceBetween: 40,

        loop: true,
        initialSlide: 0, // 첫 번째 포스터부터 시작

        slideToClickedSlide: true,

        autoplay: {
            delay: 3000,
            disableOnInteraction: false,
        },

        navigation: {
            nextEl: ".swiper-button-next",
            prevEl: ".swiper-button-prev",
        },

    });
    // 첫 번째 영화부터 시작
    swiper.slideToLoop(0, 0);

    console.log("현재 활성 슬라이드:", swiper.realIndex);
    console.log("현재 표시 영화:",
        document.querySelector(".swiper-slide-active h2")?.textContent
    );


}

/* HTML 요소 선택 */

let SearchBtn = document.querySelector("#SearchBtn");
let SearchInput = document.querySelector("#SearchInput");
let movieBoard = document.querySelector("#movieBoard");
let ticketBtn = document.querySelector("#ticketBtn");
let APIkey = "5c2bab088a75d7ea4c0c183ba4b2d488";

let movieList;



/* 영화 버튼 클릭 */

async function movie(lists) {

    let response = await fetch(
        `https://api.themoviedb.org/3/movie/${lists}?api_key=${APIkey}&language=ko-KR`
    );

    let data = await response.json();

    console.log(data.results);

    movieList = data.results;

    render(movieList);

}


/* 검색 버튼 클릭 */

SearchBtn.addEventListener("click", async () => {

    let keyword = SearchInput.value.trim();

    console.log(keyword);

    if (keyword === "") {
        alert("영화 제목을 입력해 주세요.");
        return;
    }

    let response = await fetch(
        `https://api.themoviedb.org/3/search/movie?query=${encodeURIComponent(keyword)}&api_key=${APIkey}&language=ko-KR`
    );

    let data = await response.json();

    console.log(data.results);

    movieList = data.results;

    render(movieList);

});


/* 검색창 초기화 */

SearchInput.addEventListener("focus", () => {

    SearchInput.value = "";

});


/* 화면에 영화 출력 */

function render(movieList) {

    console.log(movieList);

    // 기존 영화 삭제
    movieBoard.innerHTML = "";


    // 영화 출력
    movieList.forEach((movie) => {

        let card = `
            <div class="swiper-slide">

                <div class="card">

                    <div class="imgBox">

                        <img
                            src="${movie.poster_path
                ? `https://image.tmdb.org/t/p/w500/${movie.poster_path}`
                : ''}"
                            alt="${movie.title}"
                        />

                        <p class="overview">
                            ${over(movie.overview)}
                        </p>

                    </div>

                    <p class="date">
                        개봉일 : ${movie.release_date || "개봉일 정보 없음"}
                    </p>

                    <p class="avg">
                    <i class="fa-solid fa-ranking-star"></i>
                        평점 ${Math.round(movie.vote_average)}
                    </p>

                    <h2>
                        ${movie.title}
                    </h2>

                </div>

            </div>
        `;

        movieBoard.innerHTML += card;

    });


    // 기존 Swiper 제거
    if (swiper) {
        swiper.destroy(false, true);
        swiper = null;
    }


    // 영화가 2개 이상일 때 Swiper 생성
    if (movieList.length > 1) {
        makeSwiper();
    }
    console.log("첫 번째 영화:", movieList[0].title);
    console.log("첫 번째 포스터:", movieList[0].poster_path);

}

/* 줄거리 말줄임표 */

function over(text) {

    if (!text) {
        return "줄거리 정보가 없습니다.";
    }

    return text.length > 100
        ? text.slice(0, 100) + "···"
        : text;

}


/* 첫 화면 상영영화 */

movie("now_playing");


/* Enter 검색 */

function enter() {

    SearchBtn.click();

}


/* 애니메이션 재실행 */

function replayAnim(el, className) {

    if (!el) return;

    el.classList.remove(className);

    void el.offsetWidth;

    el.classList.add(className);

}


/* 담기 숫자 증가 + 애니메이션 */

let count = 0;

document.addEventListener("click", function (e) {

    if (e.target.closest("#ticketBtn")) {

        count++;

        const countEl = document.querySelector("#count");

        countEl.textContent = count;


        // 현재 활성화된 영화 카드
        const activeTarget =
            document.querySelector(".swiper-slide-active .card") ||
            document.querySelector(".swiper-slide-active");


        replayAnim(activeTarget, "is-collecting");

        replayAnim(countEl, "is-popped");

    }

});