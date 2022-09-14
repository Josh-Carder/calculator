let data = '';
fetch('https://script.google.com/macros/s/AKfycbxKc4DjIPXipUca0RXh8ShLaWRzBsYWgNCYrrwfDAQmy3nABHxwjnZZGBmrKdzIAerd/exec').then(res=>{
    return res.json();
}).then(sheetData=>{
    data = sheetData.data;
})

jQuery(document).ready(function($){
    
    new SlimSelect({ select: "select#country", showContent: "down", showSearch: !1, });
    new SlimSelect({ select: "select#category-staff", showContent: "down", showSearch: !1, });
    
  


      
      Array.prototype.pushUnique = function (item){
        if(this.indexOf(item) == -1) {
        //if(jQuery.inArray(item, this) == -1) {
            this.push(item);
            return true;
        }
        return false;
    } 
    Array.prototype.sum = function(){
        return (this.reduce((a, b) => a + b)).toFixed(2);
    }
    
    function addCommas(nStr) {
        nStr += '';
        x = nStr.split('.');
        x1 = x[0];
        x2 = x.length > 1 ? '.' + x[1] : '';
        var rgx = /(\d+)(\d{3})/;
        while (rgx.test(x1)) {
          x1 = x1.replace(rgx, '$1' + ',' + '$2');
        }
        return x1 + x2;
    }
    
    
    function searchList() {
        var input, filter, ul, li, a, i, txtValue;
        input = document.getElementById("search-staff");
        filter = input.value.toUpperCase();
        // ul = document.getElementById("myUL");
        li = document.querySelectorAll(".modalBox-selector-item");
        for (i = 0; i < li.length; i++) {
            a = li[i].getElementsByTagName("h4")[0];
            txtValue = a.textContent || a.innerText;
            if (txtValue.toUpperCase().indexOf(filter) > -1) {
                li[i].style.display = "";
            } else {
                li[i].style.display = "none";
            }
        }
    }
    var countryData,categoryData,onshoreCost=0,offshoreCost=0,savings=0;
    var costs = {
        onshoreCost:[],
        offshoreCost:[],
        savings:[],
    }
    String.prototype.getClear = function(){
        return +this.replace('$','').replace('£','').replace('€','').replace(/,/g,'')
    }
    $('#country').on('change', function(){
        var categoryList = document.querySelector('#category-staff');
        categoryList.innerHTML = '<option value="all" selected>All</option>';
        var categoryListArry = [];
        countryData = data.filter((v,i)=>{
            if(v['Country'] === this.value && categoryListArry.indexOf(v['Category Name']) == -1){
                // var sl = v['Category Name'] == 'HR'?'selected':'';
                categoryListArry.pushUnique(v['Category Name']);
                categoryList.innerHTML += `<option value="${v['Category Name']}">${v['Category Name']}</option>`;
                $('.currency').text(v['Currency Code & Symbol']);
            }            
            return v['Country'] === this.value;
        })
        var list = $('.table-teamList-item');
        if(list.length){
            list.each((i,v)=>{
                var d = v.dataset;
                var levels = $(v).find('.team-levels').find(':selected').val();
                var staff = $(v).find('input').val();
                var updated = countryData.filter((v,i)=>{
                    return v['Experience Levels'] == levels && v['Category Name'] == d.category && v['Role Name'] == d.title
                })[0];
                $('.onshore-'+d.index).text(addCommas(updated['Monthly Cost Onshore'].getClear() * staff))
                $('.offshore-'+d.index).text(addCommas(updated['Monthly Cost Offshore'].getClear() * staff))
                $('.saving-'+d.index).text(addCommas(updated['Monthly Savings'].getClear() * staff))
                $('.currency').text(updated['Currency Code & Symbol']);
                costs.onshoreCost[d.index] = updated['Monthly Cost Onshore'].getClear() * staff;
                costs.offshoreCost[d.index] = updated['Monthly Cost Offshore'].getClear() * staff;
                costs.savings[d.index] = updated['Annual Savings'].getClear() * staff;
                $('#monthlyCostOnshore').text(addCommas(costs.onshoreCost.sum()));
                $('#monthlyCostOffshore').text(addCommas(costs.offshoreCost.sum()));
                $('#monthlyCost').text(addCommas(costs.savings.sum()));
            })
        }
        
        $('#category-staff').trigger('change');
    });
    $('#tBody-item ').on('change','.team-levels', function(){
        var list = $('.table-teamList-item');
        if(list.length){
            list.each((i,v)=>{
                var d = v.dataset;
                var levels = $(v).find('.team-levels').find(':selected').val();
                var staff = $(v).find('input').val();
                var updated = countryData.filter((v,i)=>{
                    return v['Experience Levels'] == levels && v['Category Name'] == d.category && v['Role Name'] == d.title
                })[0];
                $('.onshore-'+d.index).text(addCommas(updated['Monthly Cost Onshore'].getClear() * staff))
                $('.offshore-'+d.index).text(addCommas(updated['Monthly Cost Offshore'].getClear() * staff))
                $('.saving-'+d.index).text(addCommas(updated['Monthly Savings'].getClear() * staff));
                costs.onshoreCost[d.index] = updated['Monthly Cost Onshore'].getClear() * staff;
                costs.offshoreCost[d.index] = updated['Monthly Cost Offshore'].getClear() * staff;
                costs.savings[d.index] = updated['Annual Savings'].getClear() * staff;
                $('#monthlyCostOnshore').text(addCommas(costs.onshoreCost.sum()));
                $('#monthlyCostOffshore').text(addCommas(costs.offshoreCost.sum()));
                $('#monthlyCost').text(addCommas(costs.savings.sum()));
            })
        }
    })
    $('#category-staff').on('change', function(){
        var selectorList = document.querySelector('.modalBox-selector-list');
        selectorList.innerHTML = '';
        // var categoryListArry = [];
      
        categoryData = countryData.filter((v,i)=>{
            if((v['Category Name'] === this.value || this.value == 'all') && v['Experience Levels'].indexOf('Intermediate') != -1){
                // categoryListArry.pushUnique(v['Category Name']);
                selectorList.innerHTML += `
                <div class="modalBox-selector-item teamRole" 
                data-country="${v['Country']}"
                data-symbol="${v['Currency Code & Symbol']}"
                data-category="${v['Category Name']}"
                data-title="${v['Role Name']}"
                data-levels="${v['Experience Levels']}"
                data-onshore="${v['Onshore Cost'].getClear()}" 
                data-offshore="${v['Offshore Cost'].getClear()}" 
                data-annual="${v['Annual Savings'].getClear()}" 
                data-monthlyOnshore="${v['Monthly Cost Onshore'].getClear()}" 
                data-monthlyOffshore="${v['Monthly Cost Offshore'].getClear()}" 
                data-monthly="${v['Monthly Savings'].getClear()}" 
                data-pr="${v['%']}" 
                data-class="Support">
                    <div class="selector-title">
                        <h4>${v['Role Name']}</h4> 
                    </div>
                    <div class="selector-description">
                        <p>${v['Role Responsibilities']}</p>
                    </div>
                </div>`
            }            
            return v['Category Name'] === this.value;
        })
        // console.log(categoryData)
    });
    function triggerEvent(){
        if(data !=''){
            $('#country').trigger('change');
            $('#category-staff').trigger('change');
            clearInterval(handle);
            document.querySelector('.loader-container').style.display = 'none';
        }
        console.log('checking')
    }
    var handle = setInterval(triggerEvent,1000)
    // console.log(countryData)
    $('#search-staff').on('input', searchList)
    $('#close').on('click',function(){
        $('#myModal').hide();
        $('#modal-content').hide();
    });

    
    $('.modalBox-selector-list').on('click','.teamRole',function(){
        var d = this.dataset;
        var $this = d.title;
        var thisClass = d.class;    

        $('.jps-tool-team-image,.jps-tool-small-title,.jps-tool-model-btn').css('display','none');
        $('.jps-calc-teamList').css('display','block');

        $('#myModal').hide();
        $('#modal-content').hide();
        let $count = $('#tBody-item').children().length;
        var value_box = $('#tBody-item');
        var saving = d.monthly;
        var row = `
            <div class="table-teamList-item row-flex" id='remove${$count}' 
            data-index="${$count}" 
            data-country="${d.country}"
            data-symbol="${d.symbol}"
            data-category="${d.category}"
            data-title="${d.title}" 
            data-levels="${d.levels}" 
            data-onshore="${d.onshore}" 
            data-offshore="${d.offshore}" 
            data-annual="${d.annual}" 
            data-monthlyonshore="${d.monthlyonshore}" 
            data-monthlyoffshore="${d.monthlyoffshore}" 
            data-monthly="${d.monthly}" 
            data-pr="${d.pr}"
            >
                <div class="cell-teamList-title">
                    <div class="itemCell teamitem-label">${$this}</div>
                </div>
                <div class="cell-flex-row teamList-text">
                    <div class="itemCell team-input-controle flex-row">
                        <button class="teamlist-subtract subtract" data-index="${$count}">−</button>
                        <input type="text" class="teamListCount addComma" id="input${$count}" value="1" >
                        <button class="teamList-add add" id="add${$count}" data-index="${$count}" >+</button>
                    </div>
                    <div class="itemCell teamitem-salary">
                        <select name="team-levels-${$count}"  class="team-levels" id="team-levels-${$count}" data-index="${$count}">
                            <option value="Junior 1-2 Years Experience">Junior</option>
                            <option selected value="Intermediate 2-4 Years Experience">Intermediate</option>
                            <option value="Senior 5+ Years Experience">Senior</option>
                        </select>
                    </div>
                    <div class="itemCell teamitem-salary"><span class="currency">${d.symbol} </span><span class="onshore-${$count}">${addCommas(d.monthlyonshore)}</span></div>
                    <div class="itemCell teamitem-salary">
                        <span class="currency">${d.symbol} </span>
                        <span class="offshore-${$count}">${addCommas(d.monthlyoffshore)}</span>
                    </div>
                    <div class="itemCell teamitem-salary"><span class="currency ">${d.symbol} </span><span class="saving-${$count}">${addCommas(saving)}</span></div>
                    <div class="itemCell teamitem-remove remove" data-title="${$this}" data-index="${$count}">×</div>
                </div>
            </div>
        `;
        value_box.append(row);
        costs.onshoreCost[$count] = +d.monthlyonshore.replace(/,/g,'');
        costs.offshoreCost[$count] = +d.monthlyoffshore.replace(/,/g,'');
        costs.savings[$count] = +d.annual.replace(/,/g,'');
        new SlimSelect({ select: "select#team-levels-"+$count, showContent: "down", showSearch: !1, });
        // console.log(costs)
        
        $('#monthlyCostOnshore').text(addCommas(costs.onshoreCost.sum()));
        $('#monthlyCostOffshore').text(addCommas(costs.offshoreCost.sum()));
        $('#monthlyCost').text(addCommas(costs.savings.sum()));
    });
    $('#tBody-item').on('input','.addComma', function(e){
        if(e.target.nodeName != 'SELECT'){
            var val = this.value.replace(/,/g, '')
            this.value = addCommas(val.replace(/[^0-9.e\,]/, ''));
        }
    });
    $('#tBody-item').on('click','.subtract',function(event){
        event.stopPropagation();
        event.stopImmediatePropagation();
        var index = this.dataset.index;
        var input = document.querySelector('#input'+index);
        var elem = document.querySelector('#remove'+index);
        var d = elem.dataset;
        // console.log(d)
        
        var id = $(this).next().attr('id');
        var val = +input.value.replace(/,/g, '');
        if(val == 0){
            // val = val-1;
            // var onshore = d.onshore * val;
            // var offshore = d.offshore * val;
            // var annual = d.annual * val;
        }else{
            val = val-1;
            var onshore = d.monthlyonshore * val;
            var offshore = d.monthlyoffshore * val;
            var annual = d.monthly * val;

            costs.onshoreCost[index] = d.monthlyonshore * val;
            costs.offshoreCost[index] = d.monthlyoffshore * val;
            costs.savings[index] = d.annual * val;
            

            $('#monthlyCostOnshore').text(addCommas(costs.onshoreCost.sum()));
            $('#monthlyCostOffshore').text(addCommas(costs.offshoreCost.sum()));
            $('#monthlyCost').text(addCommas(costs.savings.sum()));
        
            $('.onshore-'+index).text(addCommas(onshore));
            $('.offshore-'+index).text(addCommas(offshore));
            $('.saving-'+index).text(addCommas(annual));
            input.value = val;
            if(val == 0){
                var id = $(this).parent().parent().parent().attr('id');
                $('#'+id).remove();
            }
            var child = $('#tBody-item').children().length;
            if(child == '0'){
                $('.jps-tool-team-image,.jps-tool-small-title,.jps-tool-model-btn').css('display','block');
                $('.jps-calc-teamList').css('display','none');
            }
        }
    })

    // var plus2Arr = [];
    $('#tBody-item').on('click','.add',function(event){
        event.stopPropagation();
        event.stopImmediatePropagation();
        var index = this.dataset.index;
        var input = document.querySelector('#input'+index);
        var elem = document.querySelector('#remove'+index);
        var d = elem.dataset;
        // console.log(d)

        var id = $(this).next().attr('id');
        var val = +input.value.replace(/,/g, '');
        // console.log(val,d.onshore)
        
        val = val+1;
        var onshore = d.monthlyonshore * val;
        var offshore = d.monthlyoffshore * val;
        var annual = d.monthly * val;

        costs.onshoreCost[index] = d.monthlyonshore * val;
        costs.offshoreCost[index] = d.monthlyoffshore * val;
        costs.savings[index] = d.annual * val;
        // console.log(costs)
            

        $('#monthlyCostOnshore').text(addCommas(costs.onshoreCost.sum()));
        $('#monthlyCostOffshore').text(addCommas(costs.offshoreCost.sum()));
        $('#monthlyCost').text(addCommas(costs.savings.sum()));

       
        $('.onshore-'+index).text(addCommas(onshore));
        $('.offshore-'+index).text(addCommas(offshore));
        $('.saving-'+index).text(addCommas(annual));
        input.value = val;
    });

    $('#tBody-item').on('click','.remove',function(event){
        event.stopPropagation();
        event.stopImmediatePropagation();
        var index = this.dataset.index;
        costs.onshoreCost[index] = 0;
        costs.offshoreCost[index] = 0;
        costs.savings[index] = 0;

        // console.log(index,costs)
        

        $('#monthlyCostOnshore').text(addCommas(costs.onshoreCost.sum()));
        $('#monthlyCostOffshore').text(addCommas(costs.offshoreCost.sum()));
        $('#monthlyCost').text(addCommas(costs.savings.sum()));

        var id =  $(this).parent().parent().attr('id');
        $('#'+id).remove();
        
        var child = $('#tBody-item').children().length;
        if(child == '0'){
            $('.jps-tool-team-image,.jps-tool-small-title,.jps-tool-model-btn').css('display','block');
            $('.jps-calc-teamList').css('display','none');
            // var empty = 0;
            // $('#monthlyCost').text(monthlyCost);

        }
    })
    
    $('#jps-modal-show-selector, #jps-addStaff').on('click',function(){
        $('#myModal').show();
        $('#modal-content').show();
    })


})
$(function() {
  var Accordion = function(el, multiple) {
      this.el = el || {};
      this.multiple = multiple || false;

      // Variables privadas
      var links = this.el.find('.m-according__btn');
      // Evento
      links.on('click', {el: this.el, multiple: this.multiple}, this.dropdown)
  }
  Accordion.prototype.dropdown = function(e) {
      var $el = e.data.el;
      $this = $(this),
      $next = $this.parent().next();

      $next.slideToggle();
      $this.parent().parent().toggleClass('open');

      if (!e.data.multiple) {
          $el.find('.submenu').not($next).slideUp().parent().parent().removeClass('open');
      };
  }	
  var accordion = new Accordion($('.accordion'), false);
  $('#information').on('click',function(){
      $('#modal').show();
      $('#content').show();
  })
  $('#closed').on('click',function(){
      $('#modal').hide();
      $('#content').hide();
  });
  $('#reset').on('click',function(){
      $('#tBody-item').children().remove();
      $('.jps-calc-teamList').css('display','none');
      $('.jps-tool-team-image,.jps-tool-small-title,.jps-tool-model-btn').css('display','block');
      $("html, body").animate({ scrollTop: 0 }, "slow");
      return false;
  });
  $('#requestReportSubmit').on('click',function(){
      var firstName = $('#firstName').val();
      var LastName = $('#LastName').val();
      var email = $('#email').val();
      var company = $('#company').val();
      var phone = $('#phone').val();
      if(firstName||LastName||email||company||phone == ''){
          $('#message').html('Errors were found on the form.').append('<br />').append('Please correct the errors and submit the form again.')
          $('#message').css('color','red')
      }

  })
});