jQuery(document).ready(function(){
    var searchField;
    var history ;
    var h_item = '';
    var details = '' ;
    var searchresult = $(".c-search__results");
    $('.search-box').keyup(function(){  
        uniSearch($(this))
    });
    function uniSearch(elm){
        searchField = $(elm).val();
        const searchRegEx = new RegExp(`^${searchField}`, 'i');
        if(searchField.length >= 1){
            var uni_name;
            axios.get('http://universities.hipolabs.com/search?country=United+States')
                .then(function (result) {
                    var unidata = result.data
                    var list = '<ul>';
                    $.each(unidata, function(i, field){
                        uni_name = unidata [i].name .toString();
                        uni_webpage =  unidata [i].web_pages .toString();  
                        if( searchRegEx.test(uni_name)){   
                            list += '<li class="item R_flex_s" ><a  href="#" class="resulttext">'+ uni_name  +'</a></li>';
                            details = '<ul><li>Name : '+ uni_name +'</li><li>Web pages :'+ uni_webpage +'</li></ul>'                 
                        }
                    });
                    list += '</ul>';
                    $(searchresult).css('display','block');
                    $(searchresult).empty().append(list);
                    $(".item").on('click',function(){
                        selecteditem =$(this).addClass("selected").text();
                        $('#search-text').val(selecteditem);
                        setStorage(selecteditem); 
                        $(searchresult).css('display','none');
                        $(".details").css('display' , 'flex').html(details)
                    });
                })
                .catch(function (error) {
                    $(searchresult).css('display','block').html('Not Found!');
                })   
        } 
    }
    //-------------setstorage for search history-----------------------------------
    function setStorage(){
        var data = JSON.parse(localStorage.getItem("searchitem") || "[]");
        var d = new Date();
        var strDate = d.getFullYear() + "-" + (d.getMonth()+1) + "-" + d.getDate();
        var time = d.getHours() + ":" + d.getMinutes() ;
        var value = {
            title : selecteditem,
            date : strDate,
            time : time
        }
        data.push(value);
        localStorage.setItem("searchitem", JSON.stringify(data));
    }
    //----------get storage for show search history elements----------------------
    if(localStorage.getItem("searchitem") !== null){
        history = JSON.parse(localStorage.getItem("searchitem"));
        $(history).each(function(i){  
           h_item +='<div class="R_flex_s history-item close"><div class="R-flex"><span> '+ history[i].title +' </span><span> '+ history[i].date+' , '+  history[i].time +' </span></div><span class="close-item"></span></div>'
        })
        $('.search-history').css('display','flex').append(h_item);   
    }
    //----------remove cashe of search---------------------------------------------
    $('#clear-history').on('click', function(){
        localStorage.removeItem("searchitem");
        $('.search-history').html('').css('display','none');  
    })
    //------------close-----------------------------------------
    $('.close-item').on('click',function(){
        $(this).parent().remove();
    })
    //------------------------close dropdown-----------------------
    $('body').on('click', function(event){ 
        console.log(event.target.id)   
        if (event.target.id != "main-box"){ 
            $(searchresult).html('').css('display','none');
        }
    });


});