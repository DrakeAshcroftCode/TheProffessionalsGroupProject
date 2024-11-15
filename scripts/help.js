document.querySelectorAll('.question').forEach(question => {
    question.addEventListener('click', () => {
        //  click question
        question.classList.toggle('active');
        const answer = question.nextElementSibling;
        
        //  display  answer
        if (answer.style.display === 'block') {
            answer.style.display = 'none';
        } else {
            answer.style.display = 'block';
        }
    });
});
