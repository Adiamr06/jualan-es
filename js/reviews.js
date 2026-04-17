document.addEventListener('DOMContentLoaded', () => {
    const reviewForm = document.getElementById('review-form');
    const reviewsContainer = document.getElementById('reviews-container');

    if (reviewForm) {
        reviewForm.addEventListener('submit', (e) => {
            e.preventDefault();

            const name = document.getElementById('review-name').value;
            const rating = document.getElementById('review-rating').value;
            const comment = document.getElementById('review-comment').value;

            // Create stars string
            let stars = '';
            for (let i = 0; i < 5; i++) {
                stars += i < rating ? '★' : '☆';
            }

            // Create review element
            const reviewCard = document.createElement('div');
            reviewCard.className = 'review-card animate-fade';
            reviewCard.innerHTML = `
                <div class="review-header">
                    <strong>${name}</strong>
                    <span class="stars">${stars}</span>
                </div>
                <p>"${comment}"</p>
            `;

            // Prepend to container
            reviewsContainer.insertBefore(reviewCard, reviewsContainer.firstChild);

            // Reset form
            reviewForm.reset();
            alert('Terima kasih atas ulasan anda!');
        });
    }
});
