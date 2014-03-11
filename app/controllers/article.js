window.ArticleController = {

  index: function() {

    var domready = false;
    var sidebaradded = false;
    var ipad = false;
    var error = false;
    var userList;

    if ($(window).width() > 400) {
      ipad = true;
    }

    window.addEventListener("message", function(msg) {
      if (msg.data.status == "DOMLoaded" && error == false) {
        domready = true;

        var imageButton = new steroids.buttons.NavigationBarButton();
        imageButton.onTap = function() {
          openDrawer();
        }
        imageButton.imagePath = "/icons/list@2x.png"

        var leftDrawer = new steroids.views.WebView("/views/drawer/index.html");

        leftDrawer.preload({}, {
          onSuccess: function() {
            initGesture();
          }
        });

        function initGesture() {
          steroids.drawers.enableGesture({
            view: leftDrawer,
            widthOfDrawerInPixels: 250
          });
          steroids.view.navigationBar.setButtons({
            left: [imageButton]
          });
        }

        function openDrawer() {
          steroids.drawers.show({
            view: leftDrawer,
            widthOfDrawerInPixels: 250
          });
        }



        $("#loading").hide();
        $("#error").hide();

        if (ipad) {
          $(".buzzfeed").append(combined);
          $("#showMoreiPad").show();
        } else {
          $(".topcoat-list").append(append);

          var optionsOld = {
            valueNames: ['category'],
            item: '<li class="opensLayer crop topcoat-list__item" data-location="/views/article/show.html"><img class="image" /><h5 class="title"></h5><p class="category"></p><p class="difficulty></p></li>'
          };

          var options = {
            valueNames: ['category']
          };
          //userList = new List('hacker-list', options);

          $("#showMore").show();
        }

        addLinks();

      } else if (msg.data.status == "NeedArticle") {
        pushNewArticle(msg.data.id);
      } else if (msg.data.status == "Drawer") {
        if (msg.data.category == "home") {
          unfilter();
          steroids.view.navigationBar.show("Articles");
        } else {
          if (ipad) {
            $("#showMoreiPad").hide();
            filterIpad(msg.data.category);
            addLinks();
            steroids.view.navigationBar.show(msg.data.category);
          } else {
            $("#showMore").hide();
            filterList(msg.data.category);
            addLinks();
            steroids.view.navigationBar.show(msg.data.category);
          }

        }
      }
    });

    function filterList(message) {
      //   alert("filter" + message);
      userList.filter(function(item) {
        if (item.values().category.indexOf(message)!=-1) {
          return true;
        } else {
          return false;
        }
      });
      //        addLinks();
    }

    function unfilter() {
      if (ipad) {
        $(".row, .rowCap").remove();
        $(".buzzfeed").append(combined);
        addLinks();
        $("#showMoreiPad").show();
      } else {
        $("#showMore").show();

        userList.filter();
      }
      // addLinks();

    }



    steroids.view.navigationBar.show({
      titleImagePath: "/icons/mobile@2x.png"
    });

    google.load("feeds", "1");
    var show = "";
    if (ipad) {
      show = new steroids.views.WebView("views/article/showiPad.html");
    } else {
      show = new steroids.views.WebView("views/article/show.html");
    }

    show.preload();


    document.addEventListener("DOMContentLoaded", function() {
      $("#loading").show();
      $("#error").hide();
      $("#showMore").hide();
      $("#showMoreiPad").hide();

      $("#refresh").hide();
      $('#refresh').click(function() {
        location.reload();
      });

      $("#showMore").hammer().on("tap", showMore);
      $("#showMoreiPad").hammer().on("tap", showMoreiPad);

    });

    var sidepicture = "";
    var sidecaption = "";

    var picture = "";
    var caption = "";

    var append = "";
    var combined = "";
    var results = "";
    var items = "";
    var counter = 0;

    var listArray = [];
    // Our callback function, for when a feed is loaded.
    function feedLoaded(result) {
      if (!result.error) {
        items = result.xmlDocument.getElementsByTagName('item');
        for (var i = 0; i < 100; i++) {
          counter++;
          var item = items[i];
          var category = "";
          var author = item.getElementsByTagName('author')[0].firstChild.nodeValue;
          var difficulty = "";
          if (item.getElementsByTagNameNS("http://www.www.allfreecrochet.com/rss/crafting#", "difficultyLevel")[0] != null) {
            difficulty = item.getElementsByTagNameNS("http://www.www.allfreecrochet.com/rss/crafting#", "difficultyLevel")[0].firstChild.nodeValue;
          }
          var title = item.getElementsByTagName('title')[0].firstChild.nodeValue;
          var description = "";
          if (item.getElementsByTagName('description')[0] != undefined) {
            description = item.getElementsByTagName('description')[0].firstChild.nodeValue;
          }
          var link = item.getElementsByTagName('link')[0].firstChild.nodeValue;
          var pubDate = item.getElementsByTagName('pubDate')[0].firstChild.nodeValue;
          if (item.getElementsByTagName('category')[0] != null) {
            category = item.getElementsByTagName('category')[0].firstChild.nodeValue;
          }

          var image = "";
          if (item.getElementsByTagName('enclosure').item(0) != null) {
            image = item.getElementsByTagName('enclosure').item(0).getAttribute('url');
          } else {
            image = "/icons/iTunesArtwork@2x.png";
          }

          var addList = {
            counter: counter,
            image: image,
            title: title,
            category: category,
            difficulty: difficulty
          };

          listArray.push(addList);
          append = append + '<li class="opensLayer crop topcoat-list__item" data-location="/views/article/show.html" id=' + counter + '><img src="' + image + '"><h5>' + title + '</h5><p class="category">' + category + '</p><p>' + difficulty + '</p></li>';
        }

      } else {
        error = true;

        $("#loading").hide();
        $("#error").show();
        $("#refresh").show();
      }

      if (domready)
        addLinks();
    }

    function filterIpad(keyword) {
      var newArray = [];
      $(".row, .rowCap").remove();
      for (var i = 0; i < items.length; i++) {
        item = items[i];
        if (item.getElementsByTagName('category')[0] != null) {
          if (item.getElementsByTagName('category')[0].firstChild.nodeValue.search(keyword) > -1) {
            //setTimeout(function(){alert(newArray.length)}, 1);
            newArray.push(i);
            //  setTimeout(function(){alert(newArray)}, 1);     
          }
        }
        if (i == items.length - 1) {
          //setTimeout(function(){alert(newArray.length)}, 1);
          filterIpadStep2(newArray);
          //testThis(newArray);
        }
      }
    }


    function filterIpadStep2(newArray) {
      var newCombine = "";
      var pictureN = "";
      var captionN = "";
      var sidepictureN = "";
      var counter = 0;
      var bottom = Math.floor(newArray.length / 3);
      if (bottom == 0) {
        bottom++;
      }
      for (var i = 0; i < bottom; i++) {
        // setTimeout(function(){alert(newArray.length)}, 1);

        pictureN = '<div class="row">';
        captionN = '<div class="rowCap">';

        for (var j = 0; j < 3; j++) {
          var index = 3 * i + j;
          if (index > newArray.length - 1) {
            break;
          }
          var id = newArray[counter];
          var item = items[newArray[counter]];
          counter++;

          var title = "No Title";
          if (item.getElementsByTagName('title')[0] != undefined) {
            title = item.getElementsByTagName('title')[0].firstChild.nodeValue;
          }

          if (item.getElementsByTagName('enclosure').item(0) != null) {
            var image = item.getElementsByTagName('enclosure').item(0).getAttribute('url');
          } else {
            var image = "/icons/iTunesArtwork@2x.png";
          }

          pictureN = pictureN + '<div class="opensLayer col" data-location="/views/article/showiPad.html" id=' + (id + 1) + '><img src="' + image + '"/></div>';
          captionN = captionN + '<div class="opensLayer colCap" data-location="/views/article/showiPad.html" id=' + (id + 1) + '><center><h3>' + title + '</h3></center></div>';

          sidepictureN = sidepictureN + '<center><div class="opensLayer rowSidePicture" data-location="/views/article/showiPad.html" id=' + (id + 1) + '><img src="' + image + '"/></div></center>';
          sidepictureN = sidepictureN + '<div class="opensLayer rowSideArticle" data-location="/views/article/showiPad.html" id=' + (id + 1) + '><center><h4>' + title + '</h4></center></div>';

        }

        pictureN = pictureN + '</div>';
        captionN = captionN + '</div>';
        newCombine = newCombine + pictureN + captionN;

      }

      $("#loading").hide();
      $("#error").hide();
      $(".buzzfeed").append(newCombine);

    }

    function feedLoadediPad(result) {
      if (!result.error) {
        items = result.xmlDocument.getElementsByTagName('item');

        // sidepicture = '<div class="col">';
        // sidecaption = '<div class="colCap">';
        //   sidepicture = '<div class="col col-25">';

        for (var i = 0; i < 11; i++) {

          picture = '<div class="row">';
          caption = '<div class="rowCap">';

          for (var j = 0; j < 3; j++) {
            counter++;
            var index = 3 * i + j;
            var item = items[index];
            var title = item.getElementsByTagName('title')[0].firstChild.nodeValue;

            if (item.getElementsByTagName('enclosure').item(0) != null) {
              var image = item.getElementsByTagName('enclosure').item(0).getAttribute('url');
            } else {
              var image = "/icons/iTunesArtwork@2x.png";
            }

            picture = picture + '<div class="opensLayer col" data-location="/views/article/showiPad.html" id=' + counter + '><img src="' + image + '"/></div>';
            caption = caption + '<div class="opensLayer colCap" data-location="/views/article/showiPad.html" id=' + counter + '><center><h3>' + title + '</h3></center></div>';

            sidepicture = sidepicture + '<center><div class="opensLayer rowSidePicture" data-location="/views/article/showiPad.html" id=' + counter + '><img src="' + image + '"/></div></center>';
            sidepicture = sidepicture + '<div class="opensLayer rowSideArticle" data-location="/views/article/showiPad.html" id=' + counter + '><center><h4>' + title + '</h4></center></div>';

          }

          picture = picture + '</div>';
          caption = caption + '</div>';
          combined = combined + picture + caption;

        }

        //sidepicture = sidepicture + '</div>';


      } else {
        error = true;

        $("#loading").hide();
        $("#error").show();
        $("#refresh").show();
      }

      if (domready) {
        $("#loading").hide();
        $("#error").hide();
        $(".buzzfeed").append(combined);
        $("#showMoreiPad").show();

      }

    }

    function showMore() {
      var moreArticles = "";
      //alert("clicked length is " + items.length);
      for (var i = 0; i < 10; i++) {
        if (counter >= items.length) {
          //alert("no more articles");

          $("#showMore").hide();

          break;
        } else {
          // alert('not out of bounds' + counter);
          var item = items[counter];
          counter++;
          var title = item.getElementsByTagName('title')[0].firstChild.nodeValue;
          var description = "None Available";
          var difficultyLevel = "";
          if (item.getElementsByTagName('description')[0] != undefined) {
            description = item.getElementsByTagName('description')[0].firstChild.nodeValue;
          }
          if (item.getElementsByTagNameNS("http://www.www.allfreecrochet.com/rss/crafting#", "difficultyLevel")[0] != null) {
            difficultyLevel = item.getElementsByTagNameNS("http://www.www.allfreecrochet.com/rss/crafting#", "difficultyLevel")[0].firstChild.nodeValue;
          }
          var link = item.getElementsByTagName('link')[0].firstChild.nodeValue;
          var pubDate = item.getElementsByTagName('pubDate')[0].firstChild.nodeValue;
          var category = "";
          if (item.getElementsByTagName('category')[0] != null) {
            category = item.getElementsByTagName('category')[0].firstChild.nodeValue;
          }

          if (item.getElementsByTagName('enclosure').item(0) != null) {
            var image = item.getElementsByTagName('enclosure').item(0).getAttribute('url');
          } else {
            var image = "/icons/iTunesArtwork@2x.png";
          }
          moreArticles = moreArticles + '<li class="opensLayer crop topcoat-list__item" data-location="/views/article/show.html" id=' + counter + '><img src="' + image + '"><h5>' + title + '</h5><p>' + category + '</p><p>' + difficultyLevel + '</p></li>';
        }
      }
      $(".topcoat-list").append(moreArticles);

      addLinks();


    }

    function showMoreiPad() {
      var moreArticles = "";
      var pictureMore = "";
      var captionMore = "";
      //alert("clicked length is " + items.length);
      for (var i = 0; i < 4; i++) {

        pictureMore = '<div class="row">';
        captionMore = '<div class="rowCap">';

        for (var j = 0; j < 3; j++) {

          counter++

          if (counter >= items.length) {
            //alert("no more articles");

            $("#showMoreiPad").hide();

            break;
          } else {

            var item = items[counter];
            if (item.getElementsByTagName('title')[0].firstChild.nodeValue != undefined) {
              var title = item.getElementsByTagName('title')[0].firstChild.nodeValue;
            } else {
              var title = "Untitled";
            }

            var description = "No description available";

            if (item.getElementsByTagName('description')[0] != undefined) {
              description = item.getElementsByTagName('description')[0].firstChild.nodeValue;
            }
            var link = item.getElementsByTagName('link')[0].firstChild.nodeValue;
            var pubDate = item.getElementsByTagName('pubDate')[0].firstChild.nodeValue;

            var image = "";
            if (item.getElementsByTagName('enclosure').item(0) != null) {
              image = item.getElementsByTagName('enclosure').item(0).getAttribute('url');
            } else {
              image = "/icons/iTunesArtwork@2x.png";
            }
            var idnum = counter + 1;

            pictureMore = pictureMore + '<div class="opensLayer col" id=' + idnum + ' data-location="/views/article/showiPad.html?id=' + idnum + '&title=' + escape(title) + '&description=' + escape(description) + '&link=' + escape(link) + '&pubDate=' + escape(pubDate) + '&image=' + escape(image) + '"><img src="' + image + '"/></div>';
            captionMore = captionMore + '<div class="opensLayer colCap" id=' + idnum + ' data-location="/views/article/showiPad.html?id=' + idnum + '&title=' + escape(title) + '&description=' + escape(description) + '&link=' + escape(link) + '&pubDate=' + escape(pubDate) + '&image=' + escape(image) + '"><center><h3>' + title + '</h3></center></div>';

          }



        }
        pictureMore = pictureMore + '</div>';
        captionMore = captionMore + '</div>';
        moreArticles = moreArticles + pictureMore + captionMore;

      }

      $(".buzzfeed").append(moreArticles);
      addLinks();


    }

    function addLinks() {
      $(".opensLayer").hammer().on("tap", function() {
        // Create a new WebView that...
        var id = this.getAttribute("id");
        id--;

        var item = items[id];
        var title = item.getElementsByTagName('title')[0].firstChild.nodeValue;
        var description = "None Available";
        var difficultyLevel = "";
        var yarnWeight = "";
        if (item.getElementsByTagName('description')[0] != undefined) {
          description = item.getElementsByTagName('description')[0].firstChild.nodeValue;
        }

        var hookSize = "";

        if (item.getElementsByTagNameNS("http://www.www.allfreecrochet.com/rss/crafting#", "crochetHook")[0] != null) {
          hookSize = item.getElementsByTagNameNS("http://www.www.allfreecrochet.com/rss/crafting#", "crochetHook")[0].getElementsByTagNameNS("http://www.www.allfreecrochet.com/rss/crafting#", "crochetHookSize")[0].firstChild.nodeValue;
        }

        var author = item.getElementsByTagName('author')[0].firstChild.nodeValue;
        if (author == "admin@primecp.com (AllFreeCrochet.com Admins)") {
          author = "The Editors at AllFreeCrochet";
        }


        if (item.getElementsByTagNameNS("http://www.www.allfreecrochet.com/rss/crafting#", "difficultyLevel")[0] != null) {
          difficultyLevel = item.getElementsByTagNameNS("http://www.www.allfreecrochet.com/rss/crafting#", "difficultyLevel")[0].firstChild.nodeValue;
        }


        if (item.getElementsByTagNameNS("http://www.www.allfreecrochet.com/rss/crafting#", "yarnWeight")[0] != null) {
          yarnWeight = item.getElementsByTagNameNS("http://www.www.allfreecrochet.com/rss/crafting#", "yarnWeight")[0].firstChild.nodeValue;
        }

        var link = item.getElementsByTagName('link')[0].firstChild.nodeValue;
        var pubDate = item.getElementsByTagName('pubDate')[0].firstChild.nodeValue;
        var pubDateStrip = pubDate.split(' ');
        pubDateStrip.pop();
        pubDateStrip.pop();
        pubDateStrip.pop();
        pubDate = pubDateStrip.join(' ');
        var image = "";
        if (item.getElementsByTagName('enclosure').item(0) !== null) {
          image = item.getElementsByTagName('enclosure').item(0).getAttribute('url');
        } else {
          image = "/icons/iTunesArtwork@2x.png";
        }

        var articleinfo = {
          sidebaradded: sidebaradded,
          sidebar: sidepicture,
          status: "Article",
          "article": [{
            "title": title,
            "description": description,
            "image": image,
            "pubDate": pubDate,
            "link": link,
            "author": author,
            "difficultyLevel": difficultyLevel,
            "yarnWeight": yarnWeight,
            "hookSize": hookSize
          }]
        };

        // ...is pushed to the navigation stack, opening on top of the current WebView.
        steroids.layers.push({
          view: show
        }, {
          onSuccess: function() {
            window.postMessage(articleinfo, "*");
            sidebaradded = true;
          }
        });

      });
    }

    function pushNewArticle(id) {
      id--;
      var item = items[id];
      var difficultyLevel = "";
      var title = item.getElementsByTagName('title')[0].firstChild.nodeValue;
      var description = "No descriptionNode available";
      if (item.getElementsByTagName('description')[0].firstChild.nodeValue !== undefined) {
        description = item.getElementsByTagName('description')[0].firstChild.nodeValue;
      }
      var author = item.getElementsByTagName('author')[0].firstChild.nodeValue;
      if (author == "admin@primecp.com (AllFreeCrochet.com Admins)") {
        author = "The Editors at AllFreeCrochet";
      }
      var yarnWeight = "";
      if (item.getElementsByTagNameNS("http://www.www.allfreecrochet.com/rss/crafting#", "difficultyLevel")[0] != null) {
        difficultyLevel = item.getElementsByTagNameNS("http://www.www.allfreecrochet.com/rss/crafting#", "difficultyLevel")[0].firstChild.nodeValue;
      }
      var hookSize = "";

      if (item.getElementsByTagNameNS("http://www.www.allfreecrochet.com/rss/crafting#", "crochetHook")[0] != null) {
        hookSize = item.getElementsByTagNameNS("http://www.www.allfreecrochet.com/rss/crafting#", "crochetHook")[0].getElementsByTagNameNS("http://www.www.allfreecrochet.com/rss/crafting#", "crochetHookSize")[0].firstChild.nodeValue;
      }

      if (item.getElementsByTagNameNS("http://www.www.allfreecrochet.com/rss/crafting#", "yarnWeight")[0] != null) {
        yarnWeight = item.getElementsByTagNameNS("http://www.www.allfreecrochet.com/rss/crafting#", "yarnWeight")[0].firstChild.nodeValue;
      }

      var link = item.getElementsByTagName('link')[0].firstChild.nodeValue;
      var pubDate = item.getElementsByTagName('pubDate')[0].firstChild.nodeValue;
      var pubDateStrip = pubDate.split(' ');
      pubDateStrip.pop();
      pubDateStrip.pop();
      pubDateStrip.pop();
      pubDate = pubDateStrip.join(' ');

      var image = "";

      if (item.getElementsByTagName('enclosure').item(0) != null) {
        image = item.getElementsByTagName('enclosure').item(0).getAttribute('url');
      } else {
        image = "/icons/iTunesArtwork@2x.png";
      }

      var newarticle = {
        status: "NewArticle",
        "article": [{
          "title": title,
          "description": description,
          "image": image,
          "pubDate": pubDate,
          "link": link,
          "author": author,
          "difficultyLevel": difficultyLevel,
          "yarnWeight": yarnWeight,
          "hookSize": hookSize
        }]
      };

      window.postMessage(newarticle, "*");

    }


    function OnLoad() {
      // Create a feed instance that will grab Digg's feed.
      if (google.feeds != undefined) {
        var feed = new google.feeds.Feed("http://allfreecrochet.com/rss-feed");
        feed.setNumEntries(200);
        feed.setResultFormat(google.feeds.Feed.XML_FORMAT);
        if (ipad) {
          feed.load(feedLoadediPad);
        } else {
          feed.load(feedLoaded);
        }

      } else {
        $("#loading").hide();
        $("#error").show();
        $("#refresh").show();
      }
      //var feed = new google.feeds.Feed("http://allfreecrochet.com/rss-feed");
      // Calling load sends the request off.  It requires a callback function.
    }


    google.setOnLoadCallback(OnLoad);



  },

  showImage: function() {

    var imageNew = decodeURIComponent(steroids.view.params["image"]);
    var titleNew = decodeURIComponent(steroids.view.params["title"]);

    document.addEventListener("DOMContentLoaded", function() {

      $("#image").attr("src", imageNew);

    });
  },

  show: function() {

    document.addEventListener("visibilitychange", onVisibilityChange, false);

    function onVisibilityChange() {
      if (document.hidden) {
        $("#crafting").children().remove();
      }
    }

    window.addEventListener("message", function(msg) {

      if (msg.data.status == "Article") {

        $(".read").remove();

        json = msg.data.article[0];
        var title = json.title;
        var image = json.image;
        var description = json.description;
        var pubDate = json.pubDate;
        var link = json.link;
        var author = json.author;
        var difficulty = json.difficultyLevel;
        var yarn = json.yarnWeight;
        var hookSize = json.hookSize;

        var imageButton = new steroids.buttons.NavigationBarButton();
        imageButton.onTap = function() {
          window.plugins.socialsharing.share('I just read an amazing article called: ' + title + '!. You can read the article here: ' + link, "Sharing a crochet article from AllFreeCrochet.com", image);
        };

        imageButton.imagePath = "/icons/share@2x.png";

        steroids.view.navigationBar.setButtons({
          right: [imageButton]
        });

        titleNode.textContent = title;
        pubDateNode.textContent = pubDate;
        descriptionNode.textContent = description;
        // difficultyNode.textContent = difficulty;
        // yarnNode.textContent = yarn;

        if (yarn != "") {
          append = '<img src="/icons/button@2x.png" /><a style="padding-left:15px" id="difficulty">' + difficulty + '</a></br>' +
            '<img src="/icons/needle@2x.png" /><a  style="padding-left:15px" id="difficulty">' + hookSize + '</a></br>' +
            '<img src="/icons/spool@2x.png" /><a  style="padding-left:15px" id="weight">' + yarn + ' </a>';
          $("#crafting").append(append);
        }
        authorNode.textContent = author;
        if (image != "/icons/iTunesArtwork@2x.png") {
          $("#image").attr("src", image);
          $("#image").css("width", "100%");
        } else {
          // $("#image").attr("src", image);
          //  $("#image").css("max-width","80px").css("display","block").css("margin-left","auto").css("margin-right","auto");
          $("#image").attr("src", "data:image/gif;base64,R0lGODlhAQABAIAAAP///wAAACH5BAEAAAAALAAAAAABAAEAAAICRAEAOw==").css("width", "0%");
        }

        $(".share").hammer().off("tap");
        $(".share").hammer().on("tap", function() {
          window.plugins.socialsharing.share('I just read an amazing article called: ' + title + '!. You can read the article here: ' + link, "Sharing a crochet article from AllFreeCrochet.com", image);
        });

        $("#read").hammer().off("tap");
        $("#read").hammer().on("tap", function() {
          window.open(link, '_blank', 'location=yes');
        });

        var imageModal = '/views/article/showImage.html?image=' + escape(image) + '&title=' + escape(title);

        $("#image").hammer().off("tap");

        if (image != "/icons/iTunesArtwork@2x.png") {
          $("#image").hammer().on("tap", function() {

            var modalwebView = new steroids.views.WebView(imageModal);

            steroids.modal.show(modalwebView);

          });
        }

      }
    });

    document.addEventListener("DOMContentLoaded", function() {

      titleNode = document.getElementById("show-id");
      authorNode = document.getElementById("author");
      pubDateNode = document.getElementById("pubDate");
      descriptionNode = document.getElementById("description");
      difficultyNode = document.getElementById("difficulty");
      yarnNode = document.getElementById("weight");

      var domloaded = {
        status: "DOMLoaded"
      };
      window.postMessage(domloaded, "*");

      var viewportWidth = $(window).width() * 0.75;
      $(".read").css("width", viewportWidth);

    });

  },

  showiPad: function() {


    var json = "";
    var message = "I'm loaded!";
    var sidebar = "Loading";
    var titleNode = "";
    var pubDateNode = "";
    var descriptionNode = "";

    var items = "";

    document.addEventListener("visibilitychange", onVisibilityChange, false);

    function onVisibilityChange() {
      if (document.hidden) {
        $("#crafting").children().remove();
      }
    }

    window.addEventListener("message", function(msg) {
      if (msg.data.status == "NewArticle") {
        $("#crafting").children().remove();

        json = msg.data.article[0];
        var title = json.title;
        var image = json.image;
        var description = json.description;
        var pubDate = json.pubDate;
        var link = json.link;
        var difficulty = json.difficultyLevel;
        var yarn = json.yarnWeight;
        var author = json.author;
        var hookSize = json.hookSize;

        titleNode.textContent = title;
        pubDateNode.textContent = pubDate;
        descriptionNode.textContent = description;
        authorNode.textContent = author;

        if (image != "/icons/iTunesArtwork@2x.png") {
          $("#image").attr("src", image);
          $("#image").css("width", "100%");
        } else {
          $("#image").attr("src", "data:image/gif;base64,R0lGODlhAQABAIAAAP///wAAACH5BAEAAAAALAAAAAABAAEAAAICRAEAOw==").css("width", "0%");
        }

        $(".share").hammer().off("tap");
        $(".share").hammer().on("tap", function() {
          window.plugins.socialsharing.share('I just read an amazing article called: ' + title + '!. You can read the article here: ' + link, "Sharing a crochet article from AllFreeCrochet.com", image);
        });

        $("#read").hammer().off("tap");
        $("#read").hammer().on("tap", function() {
          window.open(link, '_blank', 'location=yes');
        });

        var imageModalNew = '/views/article/showImage.html?image=' + escape(image) + '&title=' + escape(title);

        $("#image").hammer().off("tap");

        if (yarn != "") {
          append = '<img src="/icons/button@2x.png" /><a style="padding-left:15px" id="difficulty">' + difficulty + '</a></br>' +
            '<img src="/icons/needle@2x.png" /><a  style="padding-left:15px" id="difficulty">' + hookSize + '</a></br>' +
            '<img src="/icons/spool@2x.png" /><a  style="padding-left:15px" id="weight">' + yarn + ' </a>';
          $("#crafting").append(append);
        }

        var imageButton = new steroids.buttons.NavigationBarButton();
        imageButton.onTap = function() {
          window.plugins.socialsharing.share('I just read an amazing article called: ' + title + '!. You can read the article here: ' + link, "Sharing a crochet article from AllFreeCrochet.com", image);
        };

        imageButton.imagePath = "/icons/share@2x.png";

        steroids.view.navigationBar.setButtons({
          right: [imageButton]
        });


        if (image != "/icons/iTunesArtwork@2x.png") {
          $("#image").hammer().on("tap", function() {

            var modalwebView = new steroids.views.WebView(imageModalNew);

            steroids.modal.show(modalwebView);

          });
        }


      } else if (msg.data.status == "Article") {

        json = msg.data.article[0];
        var title = json.title;
        var image = json.image;
        var description = json.description;
        var pubDate = json.pubDate;
        var link = json.link;
        var difficulty = json.difficultyLevel;
        var yarn = json.yarnWeight;
        var hookSize = json.hookSize;
        var author = json.author;

        titleNode.textContent = title;
        pubDateNode.textContent = pubDate;
        descriptionNode.textContent = description;
        authorNode.textContent = author;

        if (image != "/icons/iTunesArtwork@2x.png") {
          $("#image").attr("src", image);
          $("#image").css("width", "100%").css("max-height", "400px");
        } else {
          $("#image").attr("src", "data:image/gif;base64,R0lGODlhAQABAIAAAP///wAAACH5BAEAAAAALAAAAAABAAEAAAICRAEAOw==").css("width", "0%");
        }

        $(".share").hammer().off("tap");
        $(".share").hammer().on("tap", function() {
          window.plugins.socialsharing.share('I just read an amazing article called: ' + title + '!. You can read the article here: ' + link, "Sharing a crochet article from AllFreeCrochet.com", image);
        });

        if (msg.data.sidebaradded === false) {
          sidebar = msg.data.sidebar;
          $(".sidebar").append(sidebar);
        }

        var imageButton = new steroids.buttons.NavigationBarButton();
        imageButton.onTap = function() {
          window.plugins.socialsharing.share('I just read an amazing article called: ' + title + '!. You can read the article here: ' + link, "Sharing a crochet article from AllFreeCrochet.com", image);
        };

        imageButton.imagePath = "/icons/share@2x.png";

        steroids.view.navigationBar.setButtons({
          right: [imageButton]
        });

        if (yarn != "") {
          append = '<img src="/icons/button@2x.png" /><a style="padding-left:15px" id="difficulty">' + difficulty + '</a></br>' +
            '<img src="/icons/needle@2x.png" /><a  style="padding-left:15px" id="difficulty">' + hookSize + '</a></br>' +
            '<img src="/icons/spool@2x.png" /><a  style="padding-left:15px" id="weight">' + yarn + ' </a>';
          $("#crafting").append(append);
        }

        $(".opensLayer").hammer().on("tap", function() {
          var newArticle = {
            status: "NeedArticle",
            id: this.getAttribute("id")
          };

          window.postMessage(newArticle, "*");
        });

        $("#read").hammer().off("tap");
        $("#read").hammer().on("tap", function() {
          window.open(link, '_blank', 'location=yes');
        });

        var imageModal = '/views/article/showImage.html?image=' + escape(image) + '&title=' + escape(title);

        $("#image").hammer().off("tap");

        $("#image").hammer().on("tap", function() {
          // Create a new WebView that...
          modalwebView = new steroids.views.WebView(imageModal);

          steroids.modal.show(modalwebView);

        });

      }

    });

    document.addEventListener("DOMContentLoaded", function() {

      titleNode = document.getElementById("show-id");
      authorNode = document.getElementById("author");
      pubDateNode = document.getElementById("pubDate");
      descriptionNode = document.getElementById("description");
      difficultyNode = document.getElementById("difficulty");
      yarnNode = document.getElementById("weight");

      var domloaded = {
        status: "DOMLoaded"
      };
      window.postMessage(domloaded, "*");



      var viewportWidth = $(window).width() * 0.60;

      $(".read").css("width", viewportWidth);

    });


  }

};