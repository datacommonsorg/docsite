const tabGroups = document.querySelectorAll('.tab-group');

tabGroups.forEach(group => {
  const headers = group.querySelectorAll('.tab-headers li');
  const contents = group.querySelectorAll('.tab-content > div');

  headers.forEach((header, index) => {
    header.addEventListener('click', () => {
      headers.forEach(h => h.classList.remove('active'));
      contents.forEach(c => c.classList.remove('active'));

      header.classList.add('active');
      contents[index].classList.add('active');
    });
  });
});
