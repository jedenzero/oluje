var recipes=[];
var found=[];
var dragged=null;
const merge_place=document.getElementById('merge-place');
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
  if(!found.includes(item)){
    found.push(item);
    recipe_list.innerHTML+=`<div class="item" onclick="add('${item}');">${item}</div>`;
  }
}
function add(item){
  const newItem=document.createElement('div');
  newItem.classList.add('item-draggable');
  newItem.style.left=`${Math.floor(Math.random()*(merge_place.offsetWidth-200)+50)}px`;
  newItem.style.top=`${Math.floor(Math.random()*(merge_place.offsetHeight-100)+50)}px`;
  newItem.textContent=item;
  merge_place.appendChild(newItem);
  newItem.addEventListener('mousedown',dragStart);
  newItem.addEventListener('touchstart',dragStart);
}
function dragStart(e){
  e.preventDefault();
  dragged=e.target;
  document.addEventListener('mousemove',dragProgress);
  document.addEventListener('mouseup',dragEnd);
  document.addEventListener('touchmove',dragProgress,{passive:false});
  document.addEventListener('touchend',dragEnd,{passive:false});
}
function dragProgress(e){
  e.preventDefault();
  if(dragged){
    dragged.style.left=(e.clientX||e.touches[0].clientX)-dragged.clientWidth/2+'px';
    dragged.style.top=(e.clientY||e.touches[0].clientY)-dragged.clientHeight/2+'px';
  }
}
function dragEnd(e){
  e.preventDefault();
  if(removePx(dragged.style.top)>=0.8*window.innerHeight){
    remove(dragged);
  }
  for(item of document.querySelectorAll('.item-draggable')){
    if(item!=dragged&&Math.abs(removePx(item.style.left)-removePx(dragged.style.left))<=20&&Math.abs(removePx(item.style.top)-removePx(dragged.style.top))<=20){
      const recipe=recipes.find(recipe=>recipe[1]===`${item.textContent}+${dragged.textContent}`||recipe[1]===`${dragged.textContent}+${item.textContent}`);
      if(recipe){
        remove(item);
        remove(dragged);
        find(recipe[0]);
        const newItem=document.createElement('div');
        newItem.classList.add('item-draggable');
        newItem.style.left=`${(removePx(item.style.left)+removePx(dragged.style.left))/2}px`;
        newItem.style.top=`${(removePx(item.style.top)+removePx(dragged.style.top))/2}px`;
        newItem.textContent=recipe[0];
        merge_place.appendChild(newItem);
        newItem.addEventListener('mousedown',dragStart);
        newItem.addEventListener('touchstart',dragStart);
        break;
      }
    }
  };
  dragged=null;
  document.removeEventListener('mousemove',dragProgress,{passive:false});
  document.removeEventListener('mouseup',dragEnd);
  document.removeEventListener('touchmove',dragProgress,{passive:false});
  document.removeEventListener('touchend',dragEnd);
}
function remove(item){
  item.removeEventListener('mousedown',dragStart);
  item.removeEventListener('touchstart',dragStart);
  merge_place.removeChild(item);
}
function removePx(s){
  return Number(s.split('px')[0])
}