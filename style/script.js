$(document).ready(function () {
    const envelope = $('#envelope');
    const openBtn = $("#openBtn");
    const resetBtn = $("#resetBtn");

    let currentPage = 1;
    
    // [CẤU HÌNH] Tổng số dòng thư (nếu bạn thêm/bớt dòng thư ở file index.html thì phải cập nhật số này đúng bằng số trang)
    const totalPages = 23;
    
    let isOpen = false;
    let autoplayInterval = null;
    const lyricsContainer = $('.lyrics');

    // ===== NÚT MỞ =====
    openBtn.on('click', function () {
        envelope.removeClass("close").addClass("open");
        isOpen = true;
        openBtn.hide();
        resetBtn.show();
        startPhotoRotation();
        playAudioOnce();
        
        // [CẤU HÌNH] Thời gian chờ thư mở ra hoàn toàn rồi mới bắt đầu chạy chữ (1000 = 1 giây)
        setTimeout(startLyricsAutoplay, 1000);
    });

    // ===== NÚT ĐÓNG =====
    resetBtn.on('click', function () {
        envelope.removeClass("open").addClass("close");
        isOpen = false;
        stopPhotoRotation();
        
        // Dừng cuộn chữ tự động
        if (autoplayInterval) {
            clearInterval(autoplayInterval);
            autoplayInterval = null;
        }

        setTimeout(function () {
            currentPage = 1;
            // Đặt lại các dòng chữ về trạng thái ban đầu
            $(".lyric-page").removeClass("active past").hide();
            $("#page1").addClass("active").show();
            lyricsContainer.scrollTop(0);
            
            resetBtn.hide();
            openBtn.show();
        }, 600);
    });

    // ===== CUỘN CHỮ TỰ ĐỘNG =====
    function startLyricsAutoplay() {
        if (autoplayInterval) clearInterval(autoplayInterval);
        
        // Reset trạng thái hiển thị của các dòng chữ
        currentPage = 1;
        $(".lyric-page").removeClass("active past").hide();
        
        // Hiển thị câu đầu tiên
        const firstPage = $("#page1");
        firstPage.addClass("active").fadeIn(800); // 800 là thời gian câu xuất hiện (800ms = 0.8 giây)
        lyricsContainer.scrollTop(0);

        // Chạy tự động các dòng tiếp theo
        autoplayInterval = setInterval(function () {
            if (currentPage < totalPages) {
                // Chuyển dòng hiện tại sang trạng thái cũ (past - làm mờ đi)
                $("#page" + currentPage).removeClass("active").addClass("past");
                
                currentPage++;
                
                // Hiển thị dòng mới với hiệu ứng fadeIn
                const nextPage = $("#page" + currentPage);
                nextPage.addClass("active").hide().fadeIn(800); // 800ms = 0.8 giây xuất hiện mờ dần
                
                // Cuộn mượt mà xuống dòng mới
                lyricsContainer.animate({
                    scrollTop: lyricsContainer[0].scrollHeight
                }, 800); // 800ms là thời gian cuộn
            } else {
                // Đã chạy hết các dòng
                clearInterval(autoplayInterval);
                autoplayInterval = null;
            }
        }, 3000); // [CẤU HÌNH] Tốc độ chạy chữ: 3000 = 3 giây mỗi câu (tăng số lên nếu muốn chữ chạy chậm lại)
    }

    // ===== ÂM NHẠC =====
    const audio = document.getElementById("sound");
    let hasPlayed = false;

    function playAudioOnce() {
        if (!hasPlayed) {
            audio.play().then(() => {
                hasPlayed = true;
            }).catch((e) => {
                console.log("Không thể phát nhạc:", e);
            });
        }
    }

    // ===== ẢNH XUNG QUANH - LẤY TỪ THƯ MỤC IMAGES =====
    const surroundingPhotos = document.querySelectorAll('.surrounding-photos img');
    let photoInterval = null;

    // [CẤU HÌNH] DANH SÁCH CÁC HÌNH ẢNH (ở thư mục images/)
    // Nếu bạn đổi tên ảnh hoặc thêm ảnh mới, hãy điền đường dẫn ảnh tương ứng vào đây
    const imagePaths = [
        'images/1.jpg',
        'images/2.jpg',
        'images/3.jpg',
        'images/4.jpg',
        'images/5.jpg',
        'images/6.jpg',
        'images/7.jpg',
        'images/8.jpg',
        'images/9.jpg',
        'images/10.jpg',
        'images/11.jpg',
        'images/12.jpg',
        'images/13.jpg',
        'images/14.jpg',
        'images/15.jpg',
        'images/16.jpg',
        'images/17.jpg',
        'images/18.jpg',
        'images/19.jpg',
        'images/20.jpg',
        'images/21.jpg',
        'images/22.jpg',
        'images/23.jpg',
        'images/24.jpg',
        'images/25.jpg',
        'images/26.jpg',
        'images/27.jpg'
    ];

    // Hàm chọn ngẫu nhiên một ảnh từ danh sách
    function getRandomImage() {
        const randomIndex = Math.floor(Math.random() * imagePaths.length);
        return imagePaths[randomIndex];
    }

    // Hàm thay đổi ảnh cho tất cả vị trí
    function randomPhotos() {
        surroundingPhotos.forEach((img) => {
            // Mỗi ảnh sẽ được thay bằng một ảnh ngẫu nhiên khác nhau
            img.src = getRandomImage();
            // (Tùy chọn) thêm timestamp để tránh cache
            // img.src = getRandomImage() + '?v=' + Date.now();
        });
    }

    function startPhotoRotation() {
        if (photoInterval) clearInterval(photoInterval);
        randomPhotos(); // đổi ngay lập tức khi mở
        
        // [CẤU HÌNH] Tốc độ tự đổi ảnh xung quanh thư: 2000 = 2 giây đổi một lần
        photoInterval = setInterval(randomPhotos, 2000);
    }

    function stopPhotoRotation() {
        if (photoInterval) {
            clearInterval(photoInterval);
            photoInterval = null;
        }
    }
});