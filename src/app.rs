use leptos::*;
use leptos_meta::*;
use leptos_router::*;

#[component]
pub fn App() -> impl IntoView {
    view! {
        <Link rel="shortcut icon" type_="image/ico" href="/favicon.ico"/>
        <Stylesheet id="leptos" href="/pkg/zero2prod-exec.css"/>
        <Router>
            <header>
                <h1>"Emailer"</h1>
            </header>
            <main>
                <Routes>
                    <Route path="" view=Main/>
                </Routes>
            </main>
        </Router>
    }
}

#[component]
fn Main() -> impl IntoView {
    view! {
        <div>
            <h1>Hello from leptos</h1>
        </div>
    }
}