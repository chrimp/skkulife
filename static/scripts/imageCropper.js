function cropIfNotSquare(fileInput) {
    fileInput.addEventListener('change', function() {
        const file = this.files[0];
        if (file) {
            const maxSize = 5 * 1024 * 1024;
            if (file.size > maxSize) {
                alert('사진 파일의 크기는 5MB를 넘을 수 없습니다.');
                this.value = '';
                return;
            }

            const img = new Image();
            img.onload = function() {
                const canvas = document.createElement('canvas');
                const ctx = canvas.getContext('2d');
                let size, sx, sy;

                if (img.width > img.height) {
                    size = img.height;
                    sx = (img.width - img.height) / 2;
                    sy = 0;
                } else {
                    size = img.width;
                    sx = 0;
                    sy = (img.height - img.width) / 2;
                }

                canvas.width = size;
                canvas.height = size;
                ctx.drawImage(img, sx, sy, size, size, 0, 0, size, size);

                canvas.toBlob(function(blob) {
                    const croppedFile = new File([blob], file.name, { type: file.type });
                    const croppedUrl = URL.createObjectURL(croppedFile);
                    document.querySelector('.image').src = croppedUrl;

                    const dataTransfer = new DataTransfer();
                    dataTransfer.items.add(croppedFile);
                    fileInput.files = dataTransfer.files;
                }, file.type);
            };
            img.src = URL.createObjectURL(file);
        }
    });
}