/**
 * Created by Ragnarok on 29.03.2016.
 */
(function() {

var friendList = {
        left: document.querySelector('.friend__group-list_left'),
        right: document.querySelector('.friend__group-list_right')
    },
    searchRow = document.querySelector('.friend__search_row'),
    friendGroup = document.querySelector('.friend__group_row'),
    friend = document.querySelector('.friend'),
    wrapper = document.querySelector('.wrapper'),
    friendItem,friendAvatar,friendName,friendAddRemove,placeClear,objectResultSearch,objectSearch;
    if (localStorage.right) {
      var localRight = JSON.parse(localStorage.getItem('right'));
    }else {
      var localRight = {};
    }

openModal.addEventListener('click', function(e){
    wrapper.classList.add('open');
    friend.style.top = (window.innerHeight - friend.offsetHeight) / 2 + 'px';
    public();
});
wrapper.addEventListener('click', function(e){
    var eTarget = e.target;
    if(eTarget.classList.contains('open') || eTarget.classList.contains('modal__close')){
        this.classList.remove('open');
    }
});
function public(){
    VK.init({
        apiId: 5381561
    });
    VK.Auth.login(function (objAPI){
        if(objAPI.session){
            console.log('Все отлично!');
            getFriendVKapi();
        }else{
            throw new Error('безуспешно авторизован');
        }
    }, 8);
    function issetLocalStorageRight(){
        if(localStorage.right){
          for(var key in localRight){
              createList(localRight[key], friendList.right);
          }
        }
    }
    function createList(object, place){
        friendItem = document.createElement('li');
        friendItem.classList.add('friend__group-item');
        friendItem.classList.add('clearfix');
        friendItem.setAttribute('data-id', object.user_id);
        friendItem.setAttribute('draggable', 'true');

        friendAddRemove = document.createElement('div');
        friendAddRemove.classList.add('friend__group-item_add-remove');
        friendItem.appendChild(friendAddRemove);

        friendAvatar = document.createElement('img');
        friendAvatar.classList.add('friend__group-item_avatar');
        friendAvatar.setAttribute('src', object.photo_100);
        friendItem.appendChild(friendAvatar);

        friendName = document.createElement('div');
        friendName.classList.add('friend__group-item_name');
        friendName.innerText = object.first_name + ' ' + object.last_name;

        friendItem.appendChild(friendName);
        place.appendChild(friendItem);
    }
    function getFriendVKapi(){
        VK.api('friends.get' ,{fields: 'nickname,photo_100'} ,function (objAPI) {
          addUserTo(objAPI.response);
          keyupSearch();
          issetLocalStorageRight();
          save(objAPI.response);
          for(var key in objAPI.response){
            if (!localRight[key]) {
              createList(objAPI.response[key], friendList.left);// добавить параметр левого блока
            }
          }
        });
    }
    function keyupSearch(){
        searchRow.addEventListener('keyup',function(e){
          var thisIs = e.target;
          var thisIsValue = thisIs.value.trim().toLowerCase();
          var leftElementsForSearch = friendList.left.getElementsByClassName('friend__group-item_name');
          var rightElementsForSearch = friendList.right.getElementsByClassName('friend__group-item_name');
            if(thisIs.tagName === 'INPUT'){
                if(thisIs.dataset.id === 'left'){
                  searchFunc(leftElementsForSearch);
                }else if(thisIs.dataset.id === 'right'){
                  searchFunc(rightElementsForSearch);
                }
            }
            function searchFunc(searchTo) {
              for (var i = 0; i < searchTo.length; i++) {
                var parnt = paarent(searchTo[i], 'friend__group-item');
                if (searchTo[i].innerText.toLowerCase().indexOf(thisIsValue) !== -1) {
                  parnt.classList.remove('hidden');
                }else {
                  parnt.classList.add('hidden');
                }
              }
            }
        });
    }
    function addUserTo(obj){
        friendGroup.addEventListener('click',function(e){
            var eTarget = e.target;
            if(eTarget.classList.contains('friend__group-item_add-remove')){
                var elemLi = paarent(eTarget, 'friend__group-item');
                var parentLiLeft = paarent(elemLi, 'friend__group-list_left');
                var parentLiRight = paarent(elemLi, 'friend__group-list_right');
              if (parentLiLeft) {
                friendList.right.appendChild(elemLi);
              }
              if (parentLiRight) {
                friendList.left.appendChild(elemLi);
              }
            }
        });

    }
    function paarent(elem, clas) {
        var elemParent = elem.parentNode;
        while (!elemParent.classList.contains(clas)) {
          if (elemParent.nodeName === 'HTML') {
            return false;
          }
          elemParent = elemParent.parentNode;
        }
        return elemParent;
    }

    friendList.left.addEventListener('dragstart', function(e) {
        e.dataTransfer.setData('text/html', e.target.dataset.id);
    });
    friendList.right.addEventListener('dragover', function(e) {
        e.preventDefault();
    });
    friendList.right.addEventListener('drop', function(e) {
        var getDataTrans = e.dataTransfer.getData('text/html');
        var target = e.target;
        var child = friendList.left.childNodes;

        for(var i = 0; i < child.length; i++){
            if(child[i].dataset.id === getDataTrans){
                this.appendChild(child[i]);
            }
        }
    });
    function save(obj) {
      friendSave.addEventListener('click', function() {
        if (friendList.right.childNodes) {
          var child = friendList.right.childNodes;
          for (var key in obj) {
            for (var i = 0; i < child.length; i++) {
              if (+child[i].dataset.id === obj[key].user_id) {
                localRight[key] = obj[key];
              }
            }
          }
        }
        localStorage.setItem('right', JSON.stringify(localRight));
      });
    }
    friendReset.addEventListener('click', function() {
        delete localStorage.right;
        location.reload();
    });

}


}());
