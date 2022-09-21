import { useState, useEffect, useCallback } from "react";
import { useNavigate } from 'react-router-dom';
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

  const [auth, setAuth] = useState({
    discord: "",
    github: ""
  });
  const [disabled, setDisabled] = useState({
    github: false,
    discord: true,
    email: true,
    matamask: true,
  });

  const isAnonymous = true;

  let navigate = useNavigate();

  const handleClick = event => {
    event.currentTarget.disabled = true;
    console.log('button clicked');
  };

  const fixData = useCallback(() => {
    axios.get(process.env.REACT_APP_URL).then(({ data }) => {
      console.log(data)
      switch(data.connected) {
        case 0: {
          setDisabled({
            github: false,
            discord: true,
            email: true,
            matamask: true,
          });
          break;
        }
        case 1: {
          setDisabled({
            github: true,
            discord: false,
            email: false,
            matamask: false,
          });
          break;
        }
        case 2: {
          setDisabled({
            github: true,
            discord: true,
            email: false,
            matamask: false,
          });
          break;
        }
        default: {
          setDisabled({
            github: true,
            discord: true,
            email: true,
            matamask: true,
          });
          break;
        }
      }
      setValues({
        email: data.email,
        matamask: data.metamask_address,
      });
      setAuth({
        discord: data.discord_auth_url,
        github: data.github_auth_url,
      });;
    }).catch((err) => {
      console.log(err);
    })
  }, []);

  

  useEffect(() => {
    let discord, github;
    if (window.location.hash) discord = window.location.hash.slice(1).split("&").map(hash => hash.split("="))
    console.log(typeof window.location.search)
    if (window.location.search) github = window.location.search.slice(1).split("&").map(search => search.split("="));
    if (discord) {
      const discordMap = new Map(discord);
      const token_type = discordMap.get("token_type");
      const access_token = discordMap.get("access_token");
      if (token_type && access_token) {
        axios.post(`${process.env.REACT_APP_URL}discord`, {
          token_type,
          access_token,
        }).then(({ data }) => {
          console.log(data);
          navigate("/");
          fixData();
        }).catch(err => {
          console.log(err);
        })
      }
    } else if (github) {
      const githubMap = new Map(github);
      const code = githubMap.get("code");
      console.log(code)
      if (code) {
        axios.post(`${process.env.REACT_APP_URL}github`, {
          code,
        }).then(({ data }) => {
          console.log(data);
          navigate("/");
          fixData();
        }).catch(err => {
          console.log(err);
        })
      }
    } else {
      fixData();
    }
  }, [fixData, navigate]);

  

  const inputs = [
    {
      id: 1,
      name: "email",
      type: "email",
      placeholder: "Email",
      label: "Email",
      
      className:"form-control",
      //disabled: disabled.email,
    },

    {
      id: 2,
      name: "matamask",
      type: "text",
      placeholder: "Metamask Account Address",
      label: "Metamask",
      pattern: `^[0x]{0,1}[A-Za-z0-9]{2,41}$`,
      required: false,
      className:"form-control"
      //disabled: disabled.matamask,
    },
  ];

  const handleFormSubmit = () => {
    axios.post(`${process.env.REACT_APP_URL}submit`, {
      email: values.email,
      metamask_address: values.matamask,
    }).then(({ data }) => {
      console.log(data);
    })
  }

  const handleSubmit = (e) => {
    e.preventDefault();
  };

  const onChange = (e) => {
    setValues({ ...values, [e.target.name]: e.target.value });
  };

  return (
    <Wrapper>
      <div className="app">
      <Spline scene="https://prod.spline.design/l3TZIsNBg6dnwqAO/scene.splinecode" />
        <Content>
          <form onSubmit={handleSubmit}>
            <WelcomeText>Metafy</WelcomeText>
            <button
            className="buttons"
             onClick={handleClick} 
            >
              <a
                href={auth.github}
                alt="github"
                
                className="button"
              >
                Connect GitHub
              </a>
            </button>
            <button
              
              className="buttons"
            >
              <a
                href={auth.discord}
                alt="discord"
                onClick={handleClick}
                className="button"
              >
                Connect Discord
              </a>
            </button>

            {inputs.map((input) => (
              <FormInput
                key={input.id}
                {...input}
                value={values[input.name]}
                onChange={onChange}
              />
            ))}
            <button
             className="button_submit"
              onClick={handleFormSubmit}
            >
              Submit
            </button>
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
      transform: scale(0.5) transform(-50px);
      width:375px;

    }
  }
`;

const Content = styled.div`
  position: absolute;
  top: 30px;
  display: flex;
  margin-left:880px;
  flex-direction: column;
  gap: 70px;
  margin-top: 90px;
  min-height:600px;
  max-height:600px;
  
  @media (max-width: 375px) {
    width:375px;
  }  

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
    @media (max-width: 375px) {
      width:375px;
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
  font-family: "Zen Dots", cursive;
  letter-spacing: 23.5px;
  text-transform: uppercase;
`;

export default App;
