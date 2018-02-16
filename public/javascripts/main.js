 $('.main.issueBlock #issueDesc').each(function(){
        var descLength = $(this).text().length;
        var descTrimmed1 = (descLength>250)?("<span id='descTrimmed1'>"+$(this).text().substring(0,250)+"</span><span id='3dots'>...</span>"):($(this).text());
        var descTrimmed2 = (descLength>250)?("<span id='descTrimmed2' style='display:none'>"+$(this).text().substring(250)+"</span>"+"<span id='readMore' style='color:#337ab7;cursor:pointer'>Read More</span>"):"";
        
        $(this).html(descTrimmed1+descTrimmed2);
        //- (descTrimmed.length>200)?($(this).append('<span id="readMore" style="color:#337ab7;cursor:pointer">Read More</span>')):1;
        //- $('#readMore')
      });

      $('#issueDesc #readMore').click(function(){
        if($(this).text()=="Read More")
          {
            $(this).text('Read Less');
          }
        else
          $(this).text('Read More');
          $(this).siblings('#descTrimmed2').toggle();
          $(this).siblings('#3dots').toggle();
      });

      $('#expandPost').click(function(){
        $('#nextBtn').slideToggle();
        $(this).toggleClass('glyphicon-plus glyphicon-minus');
      })

      $('#openBtn').click(function(){
        $('#openIssue').show();
        $('#announcements').hide();
        $(this).css({
          'border-bottom' : '2px solid #42b72a'
        })
        $('#announcementBtn').css({
          'border-bottom' : '2px solid white'
        })
      });

      $('#announcementBtn').click(function(){
        $('#openIssue').hide();
        $('#announcements').show();
        $(this).css({
          'border-bottom' : '2px solid #42b72a'
        })
        $('#openBtn').css({
          'border-bottom' : '2px solid white'
        })
      });

      
      $('button#openIssueOption').click(function(){
        var id = $(this).parents('li.issuePart').find('i.issueStatus').attr('id');
        var thisPost = $(this);

        $.ajax({
          method : 'POST',
          url : '/openIssue/'+id,
          success: function(data){
            if(data=="1")
              {
                thisPost.parents('li.issuePart').find('i.issueStatus').removeClass("octicon-issue-closed");
                thisPost.parents('li.issuePart').find('i.issueStatus').addClass("octicon-issue-opened");
                thisPost.parents('li.issuePart').find('i.issueStatus span').text(" Open");
                thisPost.siblings('#closeIssueOption').show();
                thisPost.hide();
              }
          }
        });
      });

      //- $('button#editIssueOption').click(function(){
      //-   var editIssueOption = $(this);
      //-   $(this).prop('disabled',true);
      //-   $(this).css({
      //-     'opacity':'0.5'
      //-   });
      //-   var issueTopic = $(this).closest('li.issuePart').find('#issueTopic');
      //-   var issueDesc = $(issueTopic).siblings('#issueDesc');
        
      //-   var issueTopicText = $(issueTopic).html();
      //-   var issueDescriptionText = $(issueDesc).html();

      //-   var feed_details = $(this).closest('li.issuePart').find('#feed_details');
      //-   var feed_details_issueCommentPart = $(feed_details).html();
        
      //-   var issueId = $(this).closest('.dropdown.open').siblings('i.issueStatus').attr('id');
      //-   console.log(issueId);
        
      //-   issueTopic.html('<input type="text" id="issueDescriptionTopic" name="issueDescriptionTopic" value="'+issueTopic.text()+'" placeholder="Issue Topic" required maxlength="60"/>');
      //-   $(issueDesc).css({
      //-     "margin" : "0px",
      //-     'padding':'0px',
      //-     'padding-left': '10px'
      //-   });
      //-   issueDesc.html('<textarea style="width:100%;min-height:100px" id="issueDescriptionText" name="issueDescriptionText" placeholder="Write detailed description" required>'+issueDesc.text()+'</textarea>');
      //-   $(feed_details).find('ul#feed_numbers').hide();
        
      //-   $(feed_details).html('\
      //-   <div style="display:inline-flex;width:100%;text-align:center!important">\
      //-   <button id="cancelEditBtn" style="width:100%;float:left">\
      //-   <i style="font-size:18px;" id="likeBtnLogo" class="ionicons ion-android-cancel"></i> Cancel\
      //-   </button>\
      //-   <button id="updateEditBtn">\
      //-   <i style="font-size:18px" class="ionicons ion-android-done">\
      //-   </i> Update</button>\
      //-   </div>');

      //-   $('#cancelEditBtn').click(function(){
      //-     $(editIssueOption).prop('disabled',false);
      //-     $(editIssueOption).css({
      //-       'opacity':'1'
      //-     });
          
      //-     $(issueDesc).css({
      //-       "margin" : "5px",
      //-       'padding':'10px',
      //-       'padding-left': '5px'
      //-     });
      //-     console.log(feed_details_issueCommentPart);
      //-     $(issueTopic).html(issueTopicText);
      //-     $(issueDesc).html(issueDescriptionText);
      //-     $(feed_details).find('ul#feed_numbers').show();
      //-     $(feed_details).html(feed_details_issueCommentPart);
      //-   });

      //-   $('#updateEditBtn').click(function(){
                
      //-     $(editIssueOption).prop('disabled',false);
      //-     $(editIssueOption).css({
      //-       'opacity':'1'
      //-     });
      //-     $(issueDesc).css({
      //-       "margin" : "5px",
      //-       'padding':'10px',
      //-       'padding-left': '5px'
      //-     });
          
      //-     $.ajax({
      //-       method: 'POST',
      //-       data:{
      //-         issueId: issueId,
      //-         //orgUserId: ,
      //-         issueTopic : $(issueTopic).find('input#issueDescriptionTopic').val(),
      //-         issueDesc : $(issueDesc).find('textarea#issueDescriptionText').val()
      //-       },
      //-       url: '/updateIssue/',
      //-       success: function(data){
      //-         if(data=="1"){
      //-           $(editIssueOption).closest('div.issuePart1D').find('p#date').html(("Edited on "+new Date()).substring(0,31));
      //-           $(issueTopic).html($(issueTopic).find('input#issueDescriptionTopic').val());
      //-           $(issueDesc).html($(issueDesc).find('textarea#issueDescriptionText').val());
      //-           $(feed_details).find('ul#feed_numbers').show();
      //-           $(feed_details).html(feed_details_issueCommentPart);   
      //-         }
      //-         else{
      //-           console.log("Some Error Occured!");
      //-           $(issueTopic).html(issueTopicText);
      //-           $(issueDesc).html(issueDescriptionText);
      //-           $(feed_details).find('ul#feed_numbers').show();
      //-           $(feed_details).html(feed_details_issueCommentPart);
      //-         }
      //-       }
      //-     })
      //-   });
      //- });


      $('button#closeIssueOption').click(function(){
        console.log("Close Issue Option Select");
        var id = $(this).parents('li.issuePart').find('i.issueStatus').attr('id');
        var thisPost = $(this);

        $.ajax({
          method : 'POST',
          url : '/closeIssue/'+id,
          success: function(data){
            if(data=="1")
              {
                
                thisPost.parents('li.issuePart').find('i.issueStatus').removeClass("octicon-issue-opened");
                thisPost.parents('li.issuePart').find('i.issueStatus').addClass("octicon-issue-closed");
                thisPost.parents('li.issuePart').find('i.issueStatus span').text(" Closed");
                thisPost.siblings('#openIssueOption').show();
                thisPost.hide(); 
              }
          }
        });
      });

      $('button#delIssueOptionBtn').click(function(){
        var delIssueOptionBtn = $(this);
        $('.addDeleteAlertbackground').show();
        $('.addDeleteAlertbackground').find('p#delIssueOption').click(function(){
          var id = $(delIssueOptionBtn).closest('li.issuePart').find('i.issueStatus').attr('id');
          var delPost = $(delIssueOptionBtn);

          $.ajax({
            method : 'POST',
            url : '/delpost/'+id,
            success: function(data){
              if(data=="1")
                {
                  delPost.closest('li.issuePart').remove();
                }
            }
          });
          $('.addDeleteAlertbackground').hide();
        });
        $('#delNo').click(function(){
          $('.addDeleteAlertbackground').hide()
        });
      });

      $('li.postIssuePart#adIs').mouseover(function(){
        $(this).css({
              'box-shadow': '0 20px 60px 0 rgba(27,42,53,.25)',
              'transform': 'translateY(-1%)'
        })
      })

      $('li.postIssuePart#adIs').mouseout(function(){
              $(this).css({
                 'transform': 'translateY(1%)',
                 'box-shadow' : '0 2px 4px 0 #d4e8ff,0 2px 10px 0 #d4e8ff'
              })
      })
    
    $('button#likeBtn').click(function(e){

            //- if( $(this).find('i#likeBtnLogo').hasClass("fa-thumbs-up") )
            //-   { 
            //-    console.log("Executed 1");
            //-     $(this).parents('#feed_details').find('#num_of_likes').html(parseInt($(this).parents('#feed_details').find('#num_of_likes').text()[0])-1);
            //-   }
            
            //- else if( $(this).find('i#likeBtnLogo').hasClass('fa-thumbs-o-up') )
            //-   {
            //-    console.log("Executed 2");
            //-     $(this).parents('#feed_details').find('#num_of_likes').html(parseInt($(this).parents('#feed_details').find('#num_of_likes').text()[0])+1);
            //-   }

              e.preventDefault();
              $(this).find('i.fa').toggleClass('fa-thumbs-o-up fa-thumbs-up');
              if($(this).parents('.issueCommentPart').find('#dislikeBtn i.fa').hasClass('fa-thumbs-down')){
                  $(this).parents('.issueCommentPart').find('#dislikeBtn i.fa').removeClass('fa-thumbs-down')
                  $(this).parents('.issueCommentPart').find('#dislikeBtn i.fa').addClass('fa-thumbs-o-down');
              }
              //$(this).parents('.issueCommentPart').find('button#dislikeBtn i.fa.fa-thumbs-o-down').removeClass('fa-thumbs-down');
              //- $(this).siblings('i.fa.fa-thumbs-down').removeClass('fa-thumbs-down');
              //- $(this).siblings('i.fa').addClass('i.fa.fa-thumbs-o-down');
          
              var id = $(this).parents('li.issuePart').find('i.issueStatus').attr('id');
              console.log(id);
              $.ajax({
                url : '/favour/',
                data: {
                  userFv : "like",
                  id: id
                },
                method: 'POST'
              });
          });
    $('button#dislikeBtn').click(function(e){

        //- if( $(this).find('i#dislikeBtnLogo').hasClass("fa-thumbs-down") )
        //-   { 
        //-    console.log("Executed dislike");
        //-     $(this).parents('#feed_details').find('#num_of_dislikes').html(parseInt($(this).parents('#feed_details').find('#num_of_dislikes').text()[0])-1);
        //-   }
        
        //- else if( $(this).find('i#dislikeBtnLogo').hasClass('fa-thumbs-o-down') )
        //-   {
        //-    console.log("Executed dislike 2");
        //-     $(this).parents('#feed_details').find('#num_of_dislikes').html(parseInt($(this).parents('#feed_details').find('#num_of_dislikes').text()[0])+1);
        //-   }

        //-   e.preventDefault();
          $(this).find('i.fa').toggleClass('fa-thumbs-o-down fa-thumbs-down');
            if($(this).parents('.issueCommentPart').find('#likeBtn i.fa').addClass('fa-thumbs-o-up')){
                $(this).parents('.issueCommentPart').find('#likeBtn i.fa').removeClass('fa-thumbs-up')
                $(this).parents('.issueCommentPart').find('#likeBtn i.fa').addClass('fa-thumbs-o-up');
          }
          //$(this).parents('.issueCommentPart').find('button#likeBtn i.fa').addClass('fa-thumbs-o-up');
          //$(this).parents('.issueCommentPart').find('button#likeBtn i.fa').removeClass('fa-thumbs-up');
          
          //- $(this).siblings('i.fa.fa-thumbs-up').removeClass('fa-thumbs-up');
          //- $(this).siblings('i.fa').addClass('i.fa.fa-thumbs-o-up');

          var id = $(this).parents('li.issuePart').find('i.issueStatus').attr('id');
          console.log(id);
          $.ajax({
            url : '/favour/',
            data: {
              userFv : "dislike",
              id: id
            },
            method: 'POST'
          });
      });