window.ArticleController = {

  index: function() {

    var domready = false;
    var sidebaradded = false;
    var ipad = false;
    var error = false

    if ($(window).width() > 400) {
      ipad = true;
    }

    window.addEventListener("message", function(msg) {
      if (msg.data.status == "DOMLoaded" && error==false) {
        domready = true;

        $("#loading").hide();
        $("#error").hide();

        if (ipad) {
          $(".buzzfeed").append(combined);
          $("#showMoreiPad").show();
        } else {
          $(".topcoat-list").append(append);
          $("#showMore").show();
        }

        addLinks();

      } else if (msg.data.status == "NeedArticle") {
        pushNewArticle(msg.data.id);
      } else if (msg.data.status == "Drawer") {
        setTimeout(function() {
          alert("You touched " + msg.data.selection)
        }, 1);
      }

    });

    // if (ipad) {
    //   var leftDrawer = new steroids.views.WebView("/views/drawer/index.html");

    //   leftDrawer.preload({}, {
    //     onSuccess: function() {
    //       initGesture();
    //     }
    //   });

    //   function initGesture() {
    //     steroids.drawers.enableGesture({
    //       view: leftDrawer,
    //       widthOfDrawerInPixels: 250
    //     });
    //   }

    //   function openDrawer() {
    //     steroids.drawers.show({
    //       view: leftDrawer,
    //       widthOfDrawerInPixels: 250
    //     });
    //   }

    //   var imageButton = new steroids.buttons.NavigationBarButton();
    //   imageButton.onTap = function() {
    //     openDrawer();
    //   }

    //   imageButton.imagePath = "/icons/list@2x.png"
    //   steroids.view.navigationBar.setButtons({
    //     left: [imageButton]
    //   });
    // }

   


 //   steroids.view.navigationBar.show("");
steroids.view.navigationBar.show({
    titleImagePath: "/icons/mobile@2x.png"
});

    google.load("feeds", "1");

    if (ipad){
        var show = new steroids.views.WebView("views/article/showiPad.html");
    }
    else{
        var show = new steroids.views.WebView("views/article/show.html");
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

    // Our callback function, for when a feed is loaded.
    function feedLoaded(result) {
      if (!result.error) {
        items = result.xmlDocument.getElementsByTagName('item');
        for (var i = 0; i < 20; i++) {
          counter++
          var item = items[i];
          var title = item.getElementsByTagName('title')[0].firstChild.nodeValue;
          var description = item.getElementsByTagName('description')[0].firstChild.nodeValue;
          var link = item.getElementsByTagName('link')[0].firstChild.nodeValue;
          var pubDate = item.getElementsByTagName('pubDate')[0].firstChild.nodeValue;


          if (item.getElementsByTagName('enclosure').item(0) != null) {
            var image = item.getElementsByTagName('enclosure').item(0).getAttribute('url');
          } else {
            var image = "/icons/iTunesArtwork@2x.png";
          }

          append = append + '<li class="opensLayer crop topcoat-list__item" data-location="/views/article/show.html" id=' + counter + '><img src="' + image + '"><h4>' + title + '</h4></li>';
        }

      } else {
        error = true

        $("#loading").hide();
        $("#error").show();
        $("#refresh").show();
      }

      if (domready)
        addLinks();


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
        error = true

        $("#loading").hide();
        $("#error").show();
        $("#refresh").show();
      }

      if (domready) {
        $("#loading").hide();
        $("#error").hide();
        $(".buzzfeed").append(combined);
        $("#showMoreiPad").show();
        addLinks();

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
          if (item.getElementsByTagName('description')[0] != undefined) {
            description = item.getElementsByTagName('description')[0].firstChild.nodeValue;
          }
          var link = item.getElementsByTagName('link')[0].firstChild.nodeValue;
          var pubDate = item.getElementsByTagName('pubDate')[0].firstChild.nodeValue;

          if (item.getElementsByTagName('enclosure').item(0) != null) {
            var image = item.getElementsByTagName('enclosure').item(0).getAttribute('url');
          } else {
            var image = "/icons/iTunesArtwork@2x.png";
          }
          moreArticles = moreArticles + '<li class="opensLayer crop topcoat-list__item" data-location="/views/article/show.html" id=' + counter + '><img src="' + image + '"><h4>' + title + '</h4></li>';
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


            if (item.getElementsByTagName('enclosure').item(0) != null) {
              var image = item.getElementsByTagName('enclosure').item(0).getAttribute('url');
            } else {
              var image = "/icons/iTunesArtwork@2x.png";
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
        if (item.getElementsByTagName('description')[0] != undefined) {
          description = item.getElementsByTagName('description')[0].firstChild.nodeValue;
        }
        var link = item.getElementsByTagName('link')[0].firstChild.nodeValue;
        var pubDate = item.getElementsByTagName('pubDate')[0].firstChild.nodeValue;
        var pubDateStrip = pubDate.split(' ');
        pubDateStrip.pop();
        pubDateStrip.pop();
        pubDateStrip.pop();
        pubDate = pubDateStrip.join(' ');

        if (item.getElementsByTagName('enclosure').item(0) != null) {
          var image = item.getElementsByTagName('enclosure').item(0).getAttribute('url');
        } else {
          var image = "/icons/iTunesArtwork@2x.png";
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
            "link": link
          }]
        }

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
      var title = item.getElementsByTagName('title')[0].firstChild.nodeValue;
      var description = "No descriptionNode available";
      if (item.getElementsByTagName('description')[0].firstChild.nodeValue != undefined) {
        description = item.getElementsByTagName('description')[0].firstChild.nodeValue;
      }

      var link = item.getElementsByTagName('link')[0].firstChild.nodeValue;
      var pubDate = item.getElementsByTagName('pubDate')[0].firstChild.nodeValue;
      var pubDateStrip = pubDate.split(' ');
      pubDateStrip.pop();
      pubDateStrip.pop();
      pubDateStrip.pop();
      pubDate = pubDateStrip.join(' ');

      if (item.getElementsByTagName('enclosure').item(0) != null) {
        var image = item.getElementsByTagName('enclosure').item(0).getAttribute('url');
      } else {
        var image = "/icons/iTunesArtwork@2x.png";
      }

      var newarticle = {
        status: "NewArticle",
        "article": [{
          "title": title,
          "description": description,
          "image": image,
          "pubDate": pubDate,
          "link": link
        }]
      }

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

    window.addEventListener("message", function(msg) {
      if (msg.data.status == "Article") {
        json = msg.data.article[0];
        var title = json.title;
        var image = json.image;
        var description = json.description;
        var pubDate = json.pubDate;
        var link = json.link;

        titleNode.textContent = title;
        pubDateNode.textContent = pubDate;
        descriptionNode.textContent = description;

        $("#image").attr("src", image);

        $(".read").hammer().off("tap");

        $(".read").hammer().on("tap", function() {
          window.open(link, '_blank', 'location=yes');
        });

        var imageModal = '/views/article/showImage.html?image=' + escape(image) + '&title=' + escape(title);

        $("#image").hammer().off("tap");

        if (image!="/icons/iTunesArtwork@2x.png"){
          $("#image").hammer().on("tap", function() {

          var modalwebView = new steroids.views.WebView(imageModal);

          steroids.modal.show(modalwebView);

        });
        }

      }
    });

    document.addEventListener("DOMContentLoaded", function() {

      titleNode = document.getElementById("show-id");
      pubDateNode = document.getElementById("pubDate");
      descriptionNode = document.getElementById("description");

      var domloaded = { status: "DOMLoaded"}
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

    window.addEventListener("message", function(msg) {
      if (msg.data.status == "NewArticle") {
        json = msg.data.article[0];
        var title = json.title;
        var image = json.image;
        var description = json.description;
        var pubDate = json.pubDate;
        var link = json.link;

        titleNode.textContent = title;
        pubDateNode.textContent = pubDate;
        descriptionNode.textContent = description;

        $("#image").attr("src", image);

        $(".read").hammer().off("tap");

        $(".read").hammer().on("tap", function() {
          win = window.open(link, '_blank', 'location=yes');
        });

        var imageModalNew = '/views/article/showImage.html?image=' + escape(image) + '&title=' + escape(title);

        $("#image").hammer().off("tap");

        if (image!="/icons/iTunesArtwork@2x.png"){
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

        titleNode.textContent = title;
        pubDateNode.textContent = pubDate;
        descriptionNode.textContent = description;

        $("#image").attr("src", image);

        if (msg.data.sidebaradded == false) {
          sidebar = msg.data.sidebar;
          $(".sidebar").append(sidebar);
        }

        $(".opensLayer").hammer().on("tap", function() {
          var newArticle = {
            status: "NeedArticle",
            id: this.getAttribute("id")
          };

          window.postMessage(newArticle, "*");
        });

        $(".read").hammer().off("tap");

        $(".read").hammer().on("tap", function() {
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
      pubDateNode = document.getElementById("pubDate");
      descriptionNode = document.getElementById("description");

      var domloaded = {
        status: "DOMLoaded"
      }
      window.postMessage(domloaded, "*");



      var viewportWidth = $(window).width() * 0.60;

      $(".read").css("width", viewportWidth);

    });


  }

};

document.addEventListener("DOMContentLoaded", function()  {


});