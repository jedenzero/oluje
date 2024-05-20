var recipes=[];
var found=[];
var dragged=null;
const merging_place=document.getElementById('merging-place');
const recipe_list=document.getElementById('recipe-list');
fetch('https://sheets.googleapis.com/v4/spreadsheets/15wXy8AEYJt8uiH_DKYQuc3e6_oetyzpwTRDplaprfnY/values/recipes!A:B?key=AIzaSyATLeHQh6kM0LWRJjLg8CmzoSdnntFrmFk')
.then(response=>response.json())
.then(data=>{
  recipes=data.values;
  for(var i=0;!recipes[i][1];i++){
    find(recipes[i][0]);
  }
});
function find(item){
  found.push(item);
  recipe_list.innerHTML+=`<div class="item" onclick="add('${item}');">${item}</div>`;
}
function add(item){
  const newItem=document.createElement('div');
  newItem.classList.add('item-draggable');
  newItem.style.position='absolute';
  newItem.style.left=`${Math.floor(Math.random()*(merging_place.offsetWidth-200)+50)}px`;
  newItem.style.top=`${Math.floor(Math.random()*(merging_place.offsetHeight-100)+50)}px`;
  newItem.textContent=item;
  merging_place.appendChild(newItem);
  newItem.addEventListener('mousedown',dragStart);
}
function dragStart(e){
  e.preventDefault();
  dragged=e.target;
  document.addEventListener('mousemove',dragProgress);
  document.addEventListener('mouseup',dragEnd);
}
function dragProgress(e){
  e.preventDefault();
  if(dragged){
    dragged.style.left=e.clientX-dragged.clientWidth/2+'px';
    dragged.style.top=e.clientY-dragged.clientHeight/2+'px';
  }
}
function dragEnd(e){
  e.preventDefault();
  dragged=null;
  document.removeEventListener('mousemove',dragProgress);
  document.removeEventListener('mouseup',dragEnd);
}
function remove(item){
  item.removeEventListener('mousedown',dragStart);
  merging_place.removeChild(item);
}
