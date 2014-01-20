window.DrawerController = {

	index: function() {

		window.addEventListener("message", function(msg) {
			//alert("Message Received");
		});

		function closeDrawerAndSendMessage(selection) {
			//alert("closing " + selection);
			var drawerMessage = { status: "Drawer", selection: selection};
			window.postMessage(drawerMessage, "*");
			steroids.drawers.hideAll();
		}

		document.addEventListener("DOMContentLoaded", function(){
			$(".topcoat-list__item").hammer().on("tap", function(){
				var name = this.getAttribute("id");
				closeDrawerAndSendMessage(name);
			})
		})

	}

}

// Handle tap events on views