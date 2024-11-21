document.querySelectorAll('.help-item').forEach(item => {
    item.addEventListener('click', () => {
      console.log('Navigating to:', item.querySelector('a').href);
    });
  });