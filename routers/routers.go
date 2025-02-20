package routers

import (
	"net/http"

	//"real-time-forum/controllers"
)

// SetupRoutes initialize all endpoints of forum project
func SetupRoutes(rootMux *http.ServeMux) {
	//controllers.CreateCategories()
	rootMux.Handle("/assets/", SetupAssetsRoutes())
	// rootMux.Handle("/", SetupHomeRoutes())
	rootMux.Handle("/api/", SetupApiRoutes())
	rootMux.Handle("/auth/", SetupAuthRoutes())
}

// func SetupLoginRoutes() *http.ServeMux {
	
// }

