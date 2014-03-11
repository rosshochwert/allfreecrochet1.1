window.DrawerController = {

	index: function() {
		window.addEventListener("message", function(msg) {
			//alert("Message Received");
		});

		function closeDrawerAndSendMessage(selection) {
			var drawerMessage = { status: "Drawer", category: selection};
			window.postMessage(drawerMessage, "*");
			steroids.drawers.hideAll();
		}

		document.addEventListener("DOMContentLoaded", function(){
				steroids.view.setBackgroundColor("#437eb0");	
	
			$(".topcoat-list__item").hammer().on("tap", function(){
				var name = this.getAttribute("id");
				closeDrawerAndSendMessage(name);
			})
		})

	}

}

// Handle tap events on views