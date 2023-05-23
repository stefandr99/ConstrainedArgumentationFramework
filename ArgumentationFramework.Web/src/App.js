import "bootstrap/dist/css/bootstrap.min.css";
import Layout from "./components/layout/Layout";
import Title from "./components/ui/Title";
import Content from "./components/ui/Content";

function App() {
    return (
    <Layout>
        <Title />
        <Content />
    </Layout>);
}

export default App;