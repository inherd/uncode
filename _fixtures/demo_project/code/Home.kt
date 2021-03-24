object Sidebar {
  data class SidebarModel(val name: String, val image: String) {

  }

  class SidebarModelBehavior() {
    
  }

  class SidebarUsecases {
    companion object {
      fun checkIn() {

      }
    }
  }

  class SidebarResource {
    companion object {

      @GetMapping("/product/{code}")
      fun getProductByCode() {
        //
      }

      @PostMapping("/product/{code}")
      fun createProduct() {
        //
      }
    }
  }
}
