import { useState } from "react";
import {
  Box,
  Button,
  TextField,
  useMediaQuery,
  Typography,
  useTheme,
} from "@mui/material";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import { Formik } from "formik"; // form library 
// makes form more interactive
// make use of validationSchema, can set initialValueObject and handle form submit
import * as yup from "yup"; // use for validation (validation library) import * means import everything
//sets the validationSchema so we can use it in formik
import { useNavigate } from "react-router-dom"; // for navigation
import { useDispatch } from "react-redux"; // for action dispatching -> sending action to reducer 
import { setLogin } from "state"; // reducer
import Dropzone from "react-dropzone"; // drop a file or let the user put in the image so that user can upload a file as well 
import FlexBetween from "components/FlexBetween"; //  material ui

const registerSchema = yup.object().shape({
  firstName: yup.string().required("required"),
  lastName: yup.string().required("required"),
  email: yup.string().email("invalid email").required("required"),
  password: yup.string().required("required"),
  location: yup.string().required("required"),
  occupation: yup.string().required("required"),
  picture: yup.string().required("required"),
}); // registration schema for register form

const loginSchema = yup.object().shape({
  email: yup.string().email("invalid email").required("required"),
  password: yup.string().required("required"),
}); // login schema for login form

const initialValuesRegister = {
  firstName: "",
  lastName: "",
  email: "",
  password: "",
  location: "",
  occupation: "",
  picture: "",
};  

const initialValuesLogin = {
  email: "",
  password: "",
};

//initial value for both the form 


const Form = () => {
  const [pageType, setPageType] = useState("login"); // display the form as login or register depending on this state 
  const { palette } = useTheme();  
  const dispatch = useDispatch();  //dispatcher used to call reducer
  const navigate = useNavigate(); 
  const isNonMobile = useMediaQuery("(min-width:600px)"); //repsonsive
  const isLogin = pageType === "login"; 
  const isRegister = pageType === "register";

  const register = async (values, onSubmitProps) => {
    
    // this allows us to send form info with image
    const formData = new FormData();//Here, a new FormData object is created. FormData is a built-in JavaScript object that allows you to create a set of key/value pairs that correspond to form fields and their values.
    // loop through every key  value pair in values object and append them in the form data   
    for (let value in values) {
      formData.append(value, values[value]);
    }
    formData.append("picturePath", values.picture.name);

    const savedUserResponse = await fetch(
      "http://localhost:3001/auth/register",
      {
        method: "POST",
        body: formData,
      }
    );
    // savedUserResponse backend se woh app.post('/auth/register') se joh response aaya hai woh 
    const savedUser = await savedUserResponse.json();
    // extracts json from response and returns JS object

    // on sumbit forms comes from formik 
    onSubmitProps.resetForm();

    if (savedUser) {
      setPageType("login");
    }
    // this function converts form data into a format suitable for sending to the server,
    //  sends a POST request to the registration endpoint, 
    // handles the server's response,
    //  resets the form,
    //  and updates the page type based on the result. 
  };

  const login = async (values, onSubmitProps) => {
    const loggedInResponse = await fetch("http://localhost:3001/auth/login", {
      method: "POST",

      headers: { "Content-Type": "application/json" }, //just to show that json format type mai data bheja
      body: JSON.stringify(values), //javaScript object to JSON string //opposite parse we will do in the backend :)
    });
    const loggedIn = await loggedInResponse.json();  //READS THE RESPONSE BODY AS jsoN AND RETURNS JAVASCRIPT objECT
    console.log("In frontend , form.jsx" , loggedIn) ;
    // backend se maine login mai res mai bus user aur token bheje thai
  //  res.status(200).json({ token, user });
    onSubmitProps.resetForm();
    if (loggedIn) {
      dispatch(
        setLogin({
          user: loggedIn.user, //redux state // user waise pura ka pura user object aa raha hai 
          token: loggedIn.token,
        })
      );
      navigate("/home");
    }
  };


  const handleFormSubmit = async (values, onSubmitProps) => {
    if (isLogin) await login(values, onSubmitProps);
    if (isRegister) await register(values, onSubmitProps);
  };
//1 fr = 1 fractional unit 
  

// register 
// login
//handle formsubmit 
//three functions here to handle both forms





return (
    <Formik
      onSubmit={handleFormSubmit}
      initialValues={isLogin ? initialValuesLogin : initialValuesRegister}
      validationSchema={isLogin ? loginSchema : registerSchema}
    >
      {({
        values,
        errors,
        touched,
        handleBlur,
        handleChange,   
        handleSubmit, //triggers handleformsubmit set in it onSubmit
        setFieldValue, //part of dropzone
        resetForm,       // part of formik
      }) => (
        <form onSubmit={handleSubmit}>
          <Box
            display="grid"
            gap="30px"
            gridTemplateColumns="repeat(4, minmax(0, 1fr))" //form length type chiz hai hai ki 4 units mai likho jahan maximum 0 se leke 1fr unit tak jaye  
            sx={{
              "& > div": { gridColumn: isNonMobile ? undefined : "span 4" },
            }} // & > we are targetiing any div under the child component under the box
          >   
            {isRegister && (
              <>
                <TextField
                  label="First Name"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  value={values.firstName}
                  name="firstName"
                  error={
                    Boolean(touched.firstName) && Boolean(errors.firstName)
                  }
                  helperText={touched.firstName && errors.firstName}
                  sx={{ gridColumn: "span 2" }} //in larger screen it is going to have a span of 2 and in larger screen its going to overwrite from here gridColumn: isNonMobile ? undefined : "span 4" }, have the span of 4 
                />
                <TextField
                  label="Last Name"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  value={values.lastName}
                  name="lastName"
                  error={Boolean(touched.lastName) && Boolean(errors.lastName)}
                  helperText={touched.lastName && errors.lastName}
                  sx={{ gridColumn: "span 2" }}
                />
                <TextField
                  label="Location"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  value={values.location}
                  name="location"
                  error={Boolean(touched.location) && Boolean(errors.location)}
                  helperText={touched.location && errors.location}
                  sx={{ gridColumn: "span 4" }}
                />
                <TextField
                  label="Occupation"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  value={values.occupation}
                  name="occupation"
                  error={
                    Boolean(touched.occupation) && Boolean(errors.occupation)
                  }
                  helperText={touched.occupation && errors.occupation}
                  sx={{ gridColumn: "span 4" }}
                />
                <Box
                  gridColumn="span 4"
                  border={`1px solid ${palette.neutral.medium}`}
                  borderRadius="5px"
                  p="1rem"
                >
                  <Dropzone
                    acceptedFiles=".jpg,.jpeg,.png"
                    multiple={false} // this allows to have only 1 image
                    onDrop={(acceptedFiles) =>
                      setFieldValue("picture", acceptedFiles[0]) // formik mai setFieldValue hai 
                    }
                  >
                  
                    {({ getRootProps, getInputProps }) => ( // thi ssyntax comes from dropzone 
                      <Box
                        {...getRootProps()}
                        border={`2px dashed ${palette.primary.main}`}
                        p="1rem"
                        sx={{ "&:hover": { cursor: "pointer" } }}
                      >
                        <input {...getInputProps()} />
                        {!values.picture ? (
                          <p>Add Picture Here</p>
                        ) : (
                          <FlexBetween>
                            <Typography>{values.picture.name}</Typography>
                            <EditOutlinedIcon />
                          </FlexBetween>
                        )}
                      </Box>
                    )}
                  </Dropzone>
                </Box>
              </>
            )}
            
            <TextField // This section is both for login and register 
              label="Email"
              onBlur={handleBlur}
              onChange={handleChange}
              value={values.email}
              name="email"
              error={Boolean(touched.email) && Boolean(errors.email)}
              helperText={touched.email && errors.email}
              sx={{ gridColumn: "span 4" }}
            />
            <TextField
              label="Password"
              type="password"
              onBlur={handleBlur}
              onChange={handleChange}
              value={values.password}
              name="password"
              error={Boolean(touched.password) && Boolean(errors.password)}
              helperText={touched.password && errors.password}
              sx={{ gridColumn: "span 4" }}
            />
          </Box>

          {/* BUTTONS */}
          <Box>
            <Button
              fullWidth
              type="submit" // any time we have a button type submit inside a form its going to run the handle submit function i.e onSubmit = {handleSubmit}
              sx={{
                m: "2rem 0",
                p: "1rem",
                backgroundColor: palette.primary.main,
                color: palette.background.alt,
                "&:hover": { color: palette.primary.main },
              }}
            >
              {isLogin ? "LOGIN" : "REGISTER"}
            </Button>
            <Typography
              onClick={() => {
                setPageType(isLogin ? "register" : "login");
                resetForm();
              }}
              sx={{
                textDecoration: "underline",
                color: palette.primary.main,
                "&:hover": {
                  cursor: "pointer",
                  color: palette.primary.light,
                },
              }}
            >
              {isLogin
                ? "Don't have an account? Sign Up here."
                : "Already have an account? Login here."}
            </Typography>
          </Box>
        </form>
      )}
    </Formik>
  );
};

export default Form;


// too many syntax used refer documentation while revising



// doubt how drop zone is working here 
