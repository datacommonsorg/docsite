// Original source: https://github.com/Ovski4/jekyll-tabs/blob/master/docs/tabs.js

// This file provides the logic that ensures that the jekyll-tabs plugin works
// as expected to create an organized user experience.

// The removeActiveClasses is a helper method that removes classes marked
// as active from the specific element passed to it.

const removeActiveClasses = function (ulElement) {
  const lis = ulElement.querySelectorAll('li');
  Array.prototype.forEach.call(lis, function (li) {
    li.classList.remove('active');
  });
}

// The getChildPosition method returns an element's position in the array
// of its parent's children.

const getChildPosition = function (element) {
  var parent = element.parentNode;
  for (var i = 0; i < parent.children.length; i++) {
    if (parent.children[i] === element) {
      return i;
    }
  }

  // This line should not be reached but is retained for completeness.
  throw new Error('No parent found');
}

// The window.addEventListener logic ensures that clicking on a tab in the 
// UI changes your view to the clicked tab's contents, rather than scrolling
// to the top of the page.

window.addEventListener('load', function () {
  const tabLinks = document.querySelectorAll('ul.tab li a');

  Array.prototype.forEach.call(tabLinks, function (link) {
    link.addEventListener('click', function (event) {
      event.preventDefault();

      liTab = link.parentNode;
      if (liTab.className.includes('active')) {
        return;
      }
      ulTab = liTab.parentNode;
      position = getChildPosition(liTab);

      removeActiveClasses(ulTab);
      tabContentId = ulTab.getAttribute('data-tab');
      tabContentElement = document.getElementById(tabContentId);
      removeActiveClasses(tabContentElement);

      tabContentElement.querySelectorAll('li')[position].classList.add('active');
      liTab.classList.add('active');
    }, false);
  });
});
