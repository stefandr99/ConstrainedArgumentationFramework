import MainNavigation from "./MainNavigation";

function Layout(props) {
    return (
        <div>
            <MainNavigation />
            <div className={"container"}>
                {props.children}
            </div>
        </div>
    )
}

export default Layout;