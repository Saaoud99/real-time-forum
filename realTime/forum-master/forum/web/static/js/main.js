const URL = "/"

const map = {}
map['/'] = home
map['sign-in'] = login
const view = map[Url]
view.init()
























class home {

    init() {


        if (!userAuthorized) {
            //change url to /sign-in
            //call router function
        }
    }

    userAuthorized() {
        return true
    }
}
class login{



    init()
}