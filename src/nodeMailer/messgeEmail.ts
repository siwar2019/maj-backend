export const newsLetters = async (email: string) => {
    return `
      <!DOCTYPE html>
  <html lang="en">
    <head>
      <meta charset="UTF-8" />
      <meta http-equiv="X-UA-Compatible" content="IE=edge" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />

      <style>
      /* Container for the message */
      .message-container {
        background-color: #f2f2f2;
        border: 1px solid #ccc;
        padding: 20px;
        margin: 20px;
        text-align: center;
      }
      /* Heading */
      .reset-message-heading {
        font-size: 24px;
        font-weight: bold;
        margin-bottom: 10px;
      }
      /* Message text */
      .reset-message-text {
        font-size: 16px;
        line-height: 1.5;
        margin-bottom: 20px;
      }
      /* Reset button */
      .reset-button {
        background-color: #15c !important;
        color:white !important ;
        border: none;
        padding: 10px 20px;
        text-align: center;
        text-decoration: none;
        display: inline-block;
        font-size: 16px;
        cursor: pointer;
        transition: background-color 0.3s;
      }
      .footer {
        align-items : center  !important;
      display: flex  !important;
      color:gray
      }
    </style>
      <title>Maj mail</title>
    </head>
    <body >
    <div class="message-container">
    <h2 class="reset-message-heading">News Letter</h2>
    <p class="reset-message-text">Dear ${email},<br><br>Welcome to MAj application news Letter</p>
    <p class="reset-message-text"> If you have any questions or service, dont hesitate to visit our website  </p>
    <p class="footer" > Copyright © MAJ djeans</p>
    </body>
    </div>
  </html> 
          `;
};


export const generateEmail = async (
    receiver: string,
    userName: any,
    token: string) => {
    return `
      <!DOCTYPE html>
  <html lang="en">
    <head>
      <meta charset="UTF-8" />
      <meta http-equiv="X-UA-Compatible" content="IE=edge" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <title>Password Reset</title>
      <style>
      /* Container for the message */
      .reset-message-container {
        background-color: #f2f2f2;
        border: 1px solid #ccc;
        padding: 20px;
        margin: 20px;
        text-align: center;
      }
      /* Heading */
      .reset-message-heading {
        font-size: 24px;
        font-weight: bold;
        margin-bottom: 10px;
      }
      /* Message text */
      .reset-message-text {
        font-size: 16px;
        line-height: 1.5;
        margin-bottom: 20px;
      }
      /* Reset button */
      .reset-button {
        background-color: #15c !important;
        color:white !important ;
        border: none;
        padding: 10px 20px;
        text-align: center;
        text-decoration: none;
        display: inline-block;
        font-size: 16px;
        cursor: pointer;
        transition: background-color 0.3s;
      }
      .footer {
        align-items : center  !important;
      display: flex  !important;
      color:gray
      }
    </style>
    </head>
    <body >
    <div class="reset-message-container">
     <h2 class="reset-message-heading">Password Reset</h2>
        <p class="reset-message-text">Dear ${userName},<br><br>A password reset has been requested for your account. Click the button below to reset your password:</p>
        <a href="${process.env.CLIENT_URL}/resetpassword/${token}" class="reset-button">Reset Password</a> 
       <p class="reset-message-text"> If you have any questions about your account or our service, dont hesitate to visit our website  </p>
      <p class="footer" > Copyright © MAJ djeans</p>
    
   </div>
    </body>
  </html> 
          `;
};