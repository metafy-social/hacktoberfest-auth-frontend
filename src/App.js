import { useState, useEffect } from "react";
import axios from "axios";
import "./App.css";
import FormInput from "./components/FormInput";
import Spline from "@splinetool/react-spline";
import styled from "styled-components";

const App = () => {

  const [values, setValues] = useState({
    email: "",
    matamask: "",
  });
  console.log(process.env.REACT_APP_URL);

  const [auth,setAuth] = useState({
    discord: "",
    github: "",
    discord_disabled: false,
    github_disabled: false
  })

  useEffect(() => {
    axios.get(process.env.REACT_APP_URL).then((res) => {
      setAuth({
        discord: res.data.discord_auth_url,
        github: res.data.github_auth_url,
        discord_disabled: auth.discord_disabled,
        github_disabled: auth.github_disabled
      });
      console.log(res.data);
    }).catch((err) => {
      console.log(err);
    })
  }, []);

  

  const inputs = [
    {
      id: 1,
      name: "email",
      type: "email",
      placeholder: "Email",
      label: "Email",
      required: false,
    },

    {
      id: 2,
      name: "matamask",
      type: "text",
      placeholder: "Metamask Account Address",
      label: "Metamask",
      pattern: `^[0x]{0,1}[A-Za-z0-9]{2,41}$`,
      required: true,
    },
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
  };

  const onChange = (e) => {
    setValues({ ...values, [e.target.name]: e.target.value });
  };

  return (
    <Wrapper>
      <div className="app">
        <Spline scene="https://prod.spline.design/AOr0YkCXO4I4kPNS/scene.splinecode" />
        <Content>
          <form onSubmit={handleSubmit}>
            <WelcomeText>Metafy</WelcomeText>
            <a
              href={auth.github}
              alt="github"
              //disabled={auth.github_disabled}
            >
              <button>Connect GitHub</button>
            </a>
            <a
              href={auth.discord}
              alt="discord"
             // disabled={auth.discord_disabled}
            >
              <button>Connect Discord</button>
            </a>

            {inputs.map((input) => (
              <FormInput
                key={input.id}
                {...input}
                value={values[input.name]}
                onChange={onChange}
              />
            ))}
          </form>
        </Content>
      </div>
    </Wrapper>
  );
};

const Wrapper = styled.div`
  
  color: #fff;
  position: relative;
  display: flex;

  

    @media (max-width: 1024px) {
      transform: scale(0.8) transform(200px);
    }
    @media (max-width: 800px) {
      transform: scale(0.7) transform(600px);
    }
    @media (max-width: 600px) {
      transform: scale(0.5) transform(-100px);
      right: auto;
      left: 50%;
      margin-left: -600px;
    }
    @media (max-width: 375px) {
      transform: scale(0.45) transform(-50px);
    }
  }
`;

const Content = styled.div`
  position: absolute;
  top: 30px;
  display: flex;
  flex-direction: column;
  gap: 70px;
  margin-top: 40px;

  @media (max-width: 1024px) {
    gap: 40px;
  }

  h1 {
    font-family: Sans-serif;
    font-size: 2rem;
    font-weight: 700;
    margin: 0;

    @media (max-width: 1024px) {
      font-size: 60px;
      font-width: 400px;
    }
    @media (max-width: 800px) {
      font-size: 40px;
      font-width: 300px;
    }
    @media (max-width: 600px) {
      padding-top: 250px;
    }
  }
  p {
    font-weight: normal;
    line-height: 1.5;
    font-size: 1rem;
    max-width: 380px;
  }

  h1,
  p {
    margin: 0 30px 0 100px;
  }
`;

const WelcomeText = styled.h2`
  margin: 3rem 0 2rem 0;
`;

export default App;
