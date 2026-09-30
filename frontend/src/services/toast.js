let hideTimer;

export function showToast(message) {
	const toast = document.querySelector('.toast');
	toast.textContent = message;
	toast.classList.add('visible');
	clearTimeout(hideTimer);
	hideTimer = setTimeout(() => toast.classList.remove('visible'), 2200);
}