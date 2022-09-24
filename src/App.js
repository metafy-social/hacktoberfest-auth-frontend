import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useCookies } from "react-cookie";
import axios from "axios";
import "./App.css";
import FormInput from "./components/FormInput";
import Spline from "@splinetool/react-spline";
import styled from "styled-components";
import swal from "sweetalert";

const App = () => {
  const [values, setValues] = useState({
    email: "",
    matamask: "",
  });

  const [auth, setAuth] = useState({
    discord: "",
    github: "",
  });
  const [connect, setConnect] = useState({
    discord: "Connect Discord",
    github: "Connect GitHub",
  });
  const [disabled, setDisabled] = useState({
    email: true,
    matamask: true,
  });
  const [cookies, setCookie] = useCookies(["auth", "discord"]);

  let navigate = useNavigate();

  useEffect(() => {
    let discord, github;
    if (window.location.hash)
      discord = window.location.hash
        .slice(1)
        .split("&")
        .map((hash) => hash.split("="));
    if (window.location.search)
      github = window.location.search
        .slice(1)
        .split("&")
        .map((search) => search.split("="));
    if (discord) {
      const discordMap = new Map(discord);
      const token_type = discordMap.get("token_type");
      const access_token = discordMap.get("access_token");
      if (token_type && access_token && cookies.auth) {
        axios
          .post(
            `${process.env.REACT_APP_URL}discord`,
            {
              token_type,
              access_token,
            },
            {
              headers: {
                Authorization: `Bearer ${cookies.auth}`,
              },
            }
          )
          .then(({ data }) => {
            setDisabled({
              email: false,
              matamask: false,
            });
            setCookie("discord", "connected", { path: "/" });
            if (data.data.email) {
              setValues({
                matamask: data.data.metamask_address,
                email: data.data.email,
              });
            }
            setConnect({
              discord: "Connected Discord",
              github: "Connected GitHub",
            });
            navigate("/");
          })
          .catch(() => {});
      }
    } else if (github) {
      const githubMap = new Map(github);
      const code = githubMap.get("code");
      if (code) {
        let body = {};
        if (cookies.auth) {
          body = {
            headers: {
              Authorization: `Bearer ${cookies.auth}`,
            },
          };
        }
        axios
          .post(
            `${process.env.REACT_APP_URL}github`,
            {
              code,
            },
            body
          )
          .then(({ data }) => {
            setDisabled({
              email: false,
              matamask: false,
            });
            setCookie("auth", data.hash, { path: "/" });
            navigate("/");
          })
          .catch(() => {});
      }
    } else {
      let body = {};
      if (cookies.auth) {
        body = {
          headers: {
            Authorization: `Bearer ${cookies.auth}`,
          },
        };
      }
      axios
        .get(`${process.env.REACT_APP_URL}`, body)
        .then(({ data }) => {
          if (data) {
            setAuth({
              discord: data.discord_auth_url,
              github: data.github_auth_url,
            });
            switch (data.connected) {
              case 0: {
                setDisabled({
                  email: true,
                  matamask: true,
                });
                break;
              }
              case 1: {
                setDisabled({
                  email: false,
                  matamask: false,
                });
                setConnect({
                  discord: "Connect Discord",
                  github: "GitHub Connected",
                });
                break;
              }
              case 2: {
                setDisabled({
                  email: false,
                  matamask: false,
                });
                setConnect({
                  discord: "Discord Connected",
                  github: "GitHub Connected",
                });
                setValues({
                  email: data.email,
                  matamask: data.metamask_address,
                });
                break;
              }
              default: {
                break;
              }
            }
          }
        })
        .catch(() => {});
    }
  }, [setCookie, navigate, cookies]);

  const inputs = [
    {
      id: 1,
      name: "email",
      type: "email",
      placeholder: "Email",
      label: "Email",

      className: "form-control",
      disabled: disabled.email,
    },

    {
      id: 2,
      name: "matamask",
      type: "text",
      placeholder: "Metamask Account Address",
      label: "Metamask",
      pattern: `^[0x]{0,1}[A-Za-z0-9]{2,41}$`,
      required: false,
      className: "form-control",
      disabled: disabled.matamask,
    },
  ];

  const handleFormSubmit = () => {
    if (!cookies.auth) {
      return;
    }
    axios
      .post(
        `${process.env.REACT_APP_URL}submit`,
        {
          email: values.email,
          metamask_address: values.matamask,
        },
        {
          headers: {
            Authorization: `Bearer ${cookies.auth}`,
          },
        }
      )
      .then(() => {
        swal("All Done!", " Form Successfully Submitted!", "success");
      });
  };

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
              className="buttons btn-wdr"
              disabled={cookies.auth ? true : false}
            >
              <a href={auth.github} alt="github" className="button">
                {connect.github}
              </a>
            </button>

            <button
              className="buttons btn-wdr"
              disabled={cookies.discord ? true : false}
            >
              <a href={auth.discord} alt="discord" className="button">
                {connect.discord}
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

            <button className="button_submit" onClick={handleFormSubmit}>
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
  margin-left: 880px;
  flex-direction: column;
  gap: 70px;
  margin-top: 90px;
  min-height: 600px;
  max-height: 600px;

  @media (max-width: 375px) {
    width: 375px;
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
      width: 375px;
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
