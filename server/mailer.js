import dotenv from "dotenv";
dotenv.config(); // Načítanie environmentálnych premenných
import nodemailer from "nodemailer";
import path from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";

// Utility to get the __dirname in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Nastavenie SMTP transporter
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER, // Vaša emailová adresa
    pass: process.env.EMAIL_PASS, // Vaše heslo alebo heslo aplikácie
  },
});

export async function sendEmail(options) {
  try {
    const mailOptions = {
      from: `"SpravToZaMna" <spravtozamna.sk@gmail.com>`,
      to: options.to,
      subject: options.subject,
      text: options.text,
      html: options.html,
      attachments: options.attachments,
    };

    const result = await transporter.sendMail(mailOptions);
    console.log("Email sent:", result);
  } catch (error) {
    console.error("Error sending email:", error.message);
    if (error.response) {
      console.error("Error response data:", error.response.data);
    }
  }
}

// Email po registracii
export const welcomeEmailTemplate = (name, email) => {
  const logoPath = path.join(__dirname, "assets", "LOGO.jpg");
  console.log(`Logo path: ${logoPath}`); // Logovanie cesty k súboru

  return {
    to: email,
    subject: "Vitajte v SpravToZaMňa",
    text: `Ahoj ${name},
Vitajte v SpravToZaMňa! Ďakujeme za registráciu, teraz môžete vytvárať a ponúkať práce pre ostatných užívateľov pre uľahčenie vašeho každodenného života. Prípadne naopak sa na na tieto práce prihlásiť.

Prihlásenie do vášho nového účtu:
Login: ${email}

Sme tu, aby sme vám pomohli! Kontaktujte nás na support@SpravToZaMňa.sk, ak máte nejaké otázky.

Ďakujeme,
Tím SpravToZaMňa`,
    html: `
<!DOCTYPE html>
<html>
<head>
  <style>
  .email-container {
    font-family: Arial, sans-serif;
    line-height: 1.6;
    color: #333333;
    max-width: 600px;
    margin: 0 auto;
    padding: 20px;
    border: 1px solid #dddddd;
    border-radius: 10px;
    background-color: #ffffff; /* Zmena pozadia na biele */
  }
  .email-header, .email-footer {
    text-align: center;
  }
  .email-header img {
    max-width: 300px;
    margin-bottom: 20px;
  }
  .email-content {
    padding: 20px;
    background-color: #ffffff;
    border-radius: 10px;
  }
  .email-content h1 {
    font-size: 24px;
    color: #333333;
  }
  .email-content p {
    font-size: 16px;
    color: #333333;
    margin: 10px 0;
  }
  .email-button {
    display: inline-block;
    padding: 12px 24px;
    color: #ffffff !important; /* Explicitne nastaviť farbu textu na bielu */
    background-color: #000000;
    text-decoration: none;
    border-radius: 20px; /* Zaoblenie rohov tlačidla */
    margin-top: 20px;
    font-size: 16px;
    font-weight: bold;
    border: 2px solid #000000;
  }
  .email-button:hover {
    background-color: #333333;
    border-color: #333333;
  }
  .email-footer p {
    font-size: 12px;
    color: #777777;
    margin: 0;
  }
  a {
    color: #007BFF;
    text-decoration: none;
  }
  a:hover {
    color: #0056b3;
  }
  .email-button a {
    color: #ffffff !important; /* Uistite sa, že farba textu odkazu je biela */
    text-decoration: none;
  }
</style>
</head>
<body>
  <div class="email-container">
    <div class="email-header">
      <img src="cid:logo" alt="SpravToZaMňa">
    </div>
    <div class="email-content">
      <h1>Vitajte v SpravToZaMňa</h1>
      <p>Ahoj ${name},</p>
      <p>Vitajte v SpravToZaMňa! Ďakujeme za registráciu, teraz môžete vytvárať a ponúkať práce pre ostatných užívateľov pre uľahčenie vašeho každodenného života. Prípadne naopak sa na na tieto práce prihlásiť.</p>
      <a href="https://www.spravtozamna.sk/login" class="email-button">Prihlásiť sa do vášho nového účtu</a>
      <p><strong>Vaše nové prihlasovacie údaje:</strong></p>
      <p>Login: ${email}</p>
      <p>Sme tu, aby sme vám pomohli! Kontaktujte nás na spravtozamna.sk@gmail.com, ak máte nejaké otázky.</p>
      <p>Ďakujeme,<br>Tím SpravToZaMňa</p>
    </div>
    <div class="email-footer">
      <p>&copy; 2024 SpravToZaMňa. Všetky práva vyhradené.</p>
    </div>
  </div>
</body>
</html>
`,
    attachments: [
      {
        filename: "LOGO.jpg",
        path: logoPath,
        cid: "logo",
      },
    ],
  };
};
// resetovanie hesla mail
export const resetPasswordEmailTemplate = (name, token) => {
  return {
    subject: "Resetujte si heslo",
    text: `Ahoj ${name},
  Kliknite na tento odkaz pre resetovanie vášho hesla:
  http://localhost:5173/reset-password/${token}`,
    html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
  .email-container {
    font-family: Arial, sans-serif;
    line-height: 1.6;
    color: #333333;
    max-width: 600px;
    margin: 0 auto;
    padding: 20px;
    border: 1px solid #dddddd;
    border-radius: 10px;
    background-color: #ffffff; /* Zmena pozadia na biele */
  }
  .email-header, .email-footer {
    text-align: center;
  }
  .email-header img {
    max-width: 250px;
    margin-bottom: 20px;
  }
  .email-content {
    padding: 20px;
    background-color: #ffffff;
    border-radius: 10px;
  }
  .email-content h1 {
    font-size: 24px;
    color: #333333;
  }
  .email-content p {
    font-size: 16px;
    color: #333333;
    margin: 10px 0;
  }
  .email-button {
    display: inline-block;
    padding: 12px 24px;
    color: #ffffff !important;
    background-color: #000000;
    text-decoration: none;
    border-radius: 20px; /* Zaoblenie rohov tlačidla */
    margin-top: 20px;
    font-size: 16px;
    font-weight: bold;
    border: 2px solid #000000;
  }
  .email-button:hover {
    background-color: #333333;
    border-color: #333333;
  }
  .email-footer p {
    font-size: 12px;
    color: #777777;
    margin: 0;
  }
  a {
    color: #007BFF;
    text-decoration: none;
  }
  a:hover {
    color: #0056b3;
  }
  .email-button a {
    color: #ffffff !important;
    text-decoration: none;
  }
</style>
        </head>
        <body>
          <div class="email-container">
            <div class="email-header">
              <img src="cid:logo" alt="SpravToZaMňa">
              <h1>Resetujte si heslo</h1>
            </div>
            <div class="email-content">
              <p>Ahoj ${name},</p>
              <p>Dostali sme žiadosť o resetovanie vášho hesla.</p>
              <p>Ak ste túto akciu nežiadali, ignorujte tento e-mail. Inak, môžete resetovať svoje heslo kliknutím na tlačidlo nižšie:</p>
              <a href="http://localhost:5173/reset-password/${token}" class="email-button">Resetovať heslo</a>
              <p>Ďakujeme,<br>Team SpravToZaMňa</p>
            </div>
            <div class="email-footer">
              <p>&copy; 2024 SpravToZaMňa. Všetky práva vyhradené.</p>
            </div>
          </div>
        </body>
        </html>
      `,
    attachments: [
      {
        filename: "LOGO.jpg",
        path: path.join(__dirname, "assets", "LOGO.jpg"),
        cid: "logo",
      },
    ],
  };
};

// Mail o vytvoreni prace
export const sendJobCreationEmail = async (jobDetails) => {
  const {
    email,
    title,
    category,
    estimatedTime,
    address,
    price,
    firstName,
    lastName,
    phoneNumber,
    jobNumber,
    description,
  } = jobDetails;

  const htmlContent = `
    <!DOCTYPE html>
    <html lang="sk">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <style>
            body {
                font-family: Arial, sans-serif;
                background-color: #f4f4f4;
                margin: 0;
                padding: 0;
                color: #333333;
            }
            .container {
                width: 100%;
                max-width: 600px;
                margin: 0 auto;
                background-color: #ffffff;
                padding: 20px;
                border: 1px solid #dddddd;
            }
            .header {
                text-align: center;
                padding: 10px 0;
            }
            .header img {
                width: 250px;
            }
            .content {
                padding: 20px;
            }
            .content h1 {
                font-size: 24px;
                color: #333333;
            }
            .content p {
                font-size: 16px;
                color: #333333;
                line-height: 1.5;
            }
            .details {
                margin: 20px 0;
                border-top: 1px solid #dddddd;
                padding: 20px 0;
            }
            .details h2 {
                font-size: 18px;
                color: #333333;
            }
            .details table {
                width: 100%;
                border-collapse: collapse;
            }
            .details table th,
            .details table td {
                text-align: left;
                padding: 10px;
                border: 1px solid #dddddd;
                color: #333333;
            }
            .details table th {
                background-color: #f4f4f4;
            }
            .footer {
                text-align: center;
                padding: 20px;
                font-size: 14px;
                color: #666666;
            }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <img src="cid:logo" alt="Logo">
            </div>
            <div class="content">
                <h1>Úspešné Vytvorenie Práce</h1>
                <p>Ahoj ${firstName},</p>
                <p>Vaša práca s nasledujúcimi údajmi bola úspešne vytvorená:</p>
                <div class="details">
                    <h2>Podrobnosti Práce</h2>
                    <table>
                        <tr>
                            <th>Číslo Práce</th>
                            <td>${jobNumber}</td>
                        </tr>
                        <tr>
                            <th>Názov</th>
                            <td>${title}</td>
                        </tr>
                        <tr>
                            <th>Kategória</th>
                            <td>${category}</td>
                        </tr>
                        <tr>
                            <th>Odhadovaný Čas</th>
                            <td>${estimatedTime} hodín</td>
                        </tr>
                        <tr>
                            <th>Adresa</th>
                            <td>${address}</td>
                        </tr>
                        <tr>
                            <th>Cena</th>
                            <td>${price} €</td>
                        </tr>
                        <tr>
                            <th>Popis</th>
                            <td>${description}</td>
                        </tr>
                    </table>
                </div>
                <div class="details">
                    <h2>Vaše Kontaktné Údaje</h2>
                    <table>
                        <tr>
                            <th>Meno</th>
                            <td>${firstName}</td>
                        </tr>
                        <tr>
                            <th>Priezvisko</th>
                            <td>${lastName}</td>
                        </tr>
                        <tr>
                            <th>Telefónne Číslo</th>
                            <td>${phoneNumber}</td>
                        </tr>
                        <tr>
                            <th>Email</th>
                            <td>${email}</td>
                        </tr>
                    </table>
                </div>
            </div>
            <div class="footer">
                <p>&copy; 2024 SpravToZaMňa. Všetky práva vyhradené.</p>
            </div>
        </div>
    </body>
    </html>
  `;

  const textContent = `
    Úspešné Vytvorenie Práce
    Ahoj ${firstName},
    Vaša práca s nasledujúcimi údajmi bola úspešne vytvorená:
    
    Podrobnosti Práce
    Číslo Práce: ${jobNumber}
    Názov: ${title}
    Kategória: ${category}
    Odhadovaný Čas: ${estimatedTime} hodín
    Adresa: ${address}
    Cena: ${price} €
    Popis: ${description}
    
    Vaše Kontaktné Údaje
    Meno: ${firstName}
    Priezvisko: ${lastName}
    Telefónne Číslo: ${phoneNumber}
    Email: ${email}
    
    Ďakujeme, že ste využili naše služby!
    © 2024 SpravToZaMňa. Všetky práva vyhradené.
  `;

  await sendEmail({
    to: email,
    subject: "Úspešné Vytvorenie Práce",
    text: textContent,
    html: htmlContent,
    attachments: [
      {
        filename: "LOGO.jpg",
        path: path.resolve(__dirname, "assets/LOGO.jpg"),
        cid: "logo",
      },
    ],
  });
};
// Mail o zapisani sa na pracu pre WORKERA!
export const sendWorkerSignupEmail = async (workerDetails, jobDetails) => {
  const { email, firstName, lastName } = workerDetails;
  const {
    title,
    category,
    estimatedTime,
    address,
    price,
    jobNumber,
    description,
    creatorFirstName,
    creatorLastName,
    creatorPhoneNumber,
    creatorEmail,
    proposedDate,
    proposedTime,
  } = jobDetails;

  const htmlContent = `
      <!DOCTYPE html>
      <html lang="sk">
      <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <style>
              body {
                  font-family: Arial, sans-serif;
                  background-color: #f4f4f4;
                  margin: 0;
                  padding: 0;
                  color: #333333;
              }
              .container {
                  width: 100%;
                  max-width: 600px;
                  margin: 0 auto;
                  background-color: #ffffff;
                  padding: 20px;
                  border: 1px solid #dddddd;
                  max-height: none;
                  overflow: visible;
              }
              .header {
                  text-align: center;
                  padding: 10px 0;
              }
              .header img {
                  width: 250px;
              }
              .content {
                  padding: 20px;
              }
              .content h1 {
                  font-size: 24px;
                  color: #333333;
              }
              .content p {
                  font-size: 16px;
                  color: #333333;
                  line-height: 1.5;
              }
              .details {
                  margin: 20px 0;
                  border-top: 1px solid #dddddd;
                  padding: 20px 0;
              }
              .details h2 {
                  font-size: 18px;
                  color: #333333;
              }
              .details table {
                  width: 100%;
                  border-collapse: collapse;
              }
              .details table th,
              .details table td {
                  text-align: left;
                  padding: 10px;
                  border: 1px solid #dddddd;
                  color: #333333;
              }
              .details table th {
                  background-color: #f4f4f4;
              }
              .footer {
                  text-align: center;
                  padding: 20px;
                  font-size: 14px;
                  color: #666666;
              }
          </style>
      </head>
      <body>
          <div class="container">
              <div class="header">
                  <img src="cid:logo" alt="Logo">
              </div>
              <div class="content">
                  <h1>Potvrdenie Zápisu na Prácu</h1>
                  <p>Ahoj ${firstName},</p>
                  <p>Boli ste úspešne zapísaný na nasledujúcu prácu:</p>
                  <p style="margin-top: 8px;"><strong style="font-size: 14px;">Ak budete vybraný pre túto prácu, obdržíte potvrdzovací e-mail.</strong></p>
                  <div class="details">
                      <h2>Podrobnosti Práce</h2>
                      <table>
                          <tr>
                              <th>Číslo Práce</th>
                              <td>${jobNumber}</td>
                          </tr>
                          <tr>
                              <th>Názov</th>
                              <td>${title}</td>
                          </tr>
                          <tr>
                              <th>Kategória</th>
                              <td>${category}</td>
                          </tr>
                          <tr>
                              <th>Odhadovaný Čas</th>
                              <td>${estimatedTime} hodín</td>
                          </tr>
                          <tr>
                              <th>Adresa</th>
                              <td>${address}</td>
                          </tr>
                          <tr>
                              <th>Cena</th>
                              <td>${price} €</td>
                          </tr>
                          <tr>
                              <th>Popis</th>
                              <td>${description}</td>
                          </tr>
                      </table>
                  </div>
                  <div class="details">
                      <h2>Kontaktné Údaje Zadávateľa</h2>
                      <table>
                          <tr>
                              <th>Meno</th>
                              <td>${creatorFirstName}</td>
                          </tr>
                          <tr>
                              <th>Priezvisko</th>
                              <td>${creatorLastName}</td>
                          </tr>
                          <tr>
                              <th>Telefónne Číslo</th>
                              <td>${creatorPhoneNumber}</td>
                          </tr>
                          <tr>
                              <th>Email</th>
                              <td>${creatorEmail}</td>
                          </tr>
                      </table>
                  </div>
                  <div class=details>
                    <h2> Váš navrhnutý dátum a čas práce </h2>
                    <table>
                        <tr>
                            <th> Dátum práce</th>
                            <td>${new Date(proposedDate).toLocaleDateString("sk-SK", {
                                day: "numeric",
                                month: "long",
                                year: "numeric"})}
                                
                            </td>
                        </tr>
                        <tr>
                            <th>Čas práce </th>
                            <td>${proposedTime}</td>
                        </tr>
                    </table>
              </div>
              <div class="footer">
                  <p>&copy; 2024 SpravToZaMňa. Všetky práva vyhradené.</p>
              </div>
          </div>
      </body>
      </html>
    `;

  const textContent = `
      Potvrdenie Zápisu na Prácu
      Ahoj ${firstName} ${lastName},
      Boli ste úspešne zapísaný na nasledujúcu prácu:
      Ak budete vybrany pre tuto pracu tak vam taktiez pride mail o potvrdeni.
      
      Podrobnosti Práce
      Číslo Práce: ${jobNumber}
      Názov: ${title}
      Kategória: ${category}
      Odhadovaný Čas: ${estimatedTime} hodín
      Adresa: ${address}
      Cena: ${price} €
      Popis: ${description}
      
      Kontaktné Údaje Tvorcu Práce
      Meno: ${creatorFirstName}
      Priezvisko: ${creatorLastName}
      Telefónne Číslo: ${creatorPhoneNumber}
      Email: ${creatorEmail}

      
    
      Ďakujeme, že ste využili naše služby!
      © 2024 SpravToZaMňa. Všetky práva vyhradené.
    `;

  await sendEmail({
    to: email,
    subject: "Potvrdenie Zapísania sa na Prácu",
    text: textContent,
    html: htmlContent,
    attachments: [
      {
        filename: "LOGO.jpg",
        path: path.join(__dirname, "./assets/LOGO.jpg"),
        cid: "logo",
      },
    ],
  });
};
// Template for worker signup notification to creator
export const sendWorkerSignupNotificationToCreator = async (
  workerDetails,
  jobDetails
) => {
  const {
    email: workerEmail,
    firstName: workerFirstName,
    lastName: workerLastName,
    phone: workerphone,
  } = workerDetails;

  const {
    title,
    category,
    estimatedTime,
    address,
    price,
    jobNumber,
    description,
    creatorFirstName,
    creatorLastName,
    creatorPhoneNumber,
    creatorEmail,
    proposedDate,
    proposedTime
  } = jobDetails;

  const htmlContent = `
      <!DOCTYPE html>
      <html lang="sk">
      <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <style>
              body {
                  font-family: Arial, sans-serif;
                  background-color: #f4f4f4;
                  margin: 0;
                  padding: 0;
                  color: #333333;
              }
              .container {
                  width: 100%;
                  max-width: 600px;
                  margin: 0 auto;
                  background-color: #ffffff;
                  padding: 20px;
                  border: 1px solid #dddddd;
              }
              .header {
                  text-align: center;
                  padding: 10px 0;
              }
              .header img {
                  width: 250px;
              }
              .content {
                  padding: 20px;
              }
              .content h1 {
                  font-size: 24px;
                  color: #333333;
              }
              .content p {
                  font-size: 16px;
                  color: #333333;
                  line-height: 1.5;
              }
              .details {
                  margin: 20px 0;
                  border-top: 1px solid #dddddd;
                  padding: 20px 0;
              }
              .details h2 {
                  font-size: 18px;
                  color: #333333;
              }
              .details table {
                  width: 100%;
                  border-collapse: collapse;
              }
              .details table th,
              .details table td {
                  text-align: left;
                  padding: 10px;
                  border: 1px solid #dddddd;
                  color: #333333;
              }
              .details table th {
                  background-color: #f4f4f4;
              }
              .footer {
                  text-align: center;
                  padding: 20px;
                  font-size: 14px;
                  color: #666666;
              }
          </style>
      </head>
      <body>
          <div class="container">
              <div class="header">
                  <img src="cid:logo" alt="Logo">
              </div>
              <div class="content">
                  <h1>Nový Pracovník sa Zapísal na Vašu Prácu</h1>
                  <p>Ahoj ${creatorFirstName},</p>
                  <p>Pracovník ${workerFirstName} ${workerLastName} sa úspešne zapísal na nasledujúcu prácu:</p>
                  <div class="details">
                      <h2>Podrobnosti Práce</h2>
                      <table>
                          <tr>
                              <th>Číslo Práce</th>
                              <td>${jobNumber}</td>
                          </tr>
                          <tr>
                              <th>Názov</th>
                              <td>${title}</td>
                          </tr>
                          <tr>
                              <th>Kategória</th>
                              <td>${category}</td>
                          </tr>
                          <tr>
                              <th>Odhadovaný Čas</th>
                              <td>${estimatedTime} hodín</td>
                          </tr>
                          <tr>
                              <th>Adresa</th>
                              <td>${address}</td>
                          </tr>
                          <tr>
                              <th>Cena</th>
                              <td>${price} €</td>
                          </tr>
                          <tr>
                              <th>Popis</th>
                              <td>${description}</td>
                          </tr>
                      </table>
                  </div>
                  <div class="details">
                      <h2>Kontaktné Údaje Pracovníka</h2>
                      <table>
                          <tr>
                              <th>Meno</th>
                              <td>${workerFirstName}</td>
                          </tr>
                          <tr>
                              <th>Priezvisko</th>
                              <td>${workerLastName}</td>
                          </tr>
                          <tr>
                              <th>Email</th>
                              <td>${workerEmail}</td>
                          </tr>
                          <tr>
                              <th>Tel. číslo</th>
                              <td>${workerphone}</td>
                          </tr>
                      </table>
                  </div>
                  <div class="details">
                    <h2>Navrhnutý dátum a čas práce používateľom </h2>
                    <table>
                        <tr>
                            <th>Dátum</th>
                            <td>${new Date(proposedDate).toLocaleDateString("sk-SK", {
                                day:"numeric",
                                month:"long",
                                year:"numeric"})}
                            </td>
                            <th>Čas</th>
                            <td>${proposedTime}</td>
                        </tr>
                    </table>
                    <p>V prípade, že Vám tento dátum nevyhovuje, môžete mu navrhnúť iný pri potvrdzovaní používateľa</p>
                   </div>
                  <p style="margin-top: 8px;"><strong style="font-size: 14px;">Ak budete mať akékoľvek otázky, neváhajte nás kontaktovať.</strong></p>
              </div>
              <div class="footer">
                  <p>&copy; 2024 SpravToZaMňa. Všetky práva vyhradené.</p>
              </div>
          </div>
      </body>
      </html>
    `;

  const textContent = `
      Nový Pracovník sa Zapísal na Vašu Prácu
      Ahoj ${creatorFirstName},
      Pracovník ${workerFirstName} ${workerLastName} sa úspešne zapísal na nasledujúcu prácu:
      
      Podrobnosti Práce
      Číslo Práce: ${jobNumber}
      Názov: ${title}
      Kategória: ${category}
      Odhadovaný Čas: ${estimatedTime} hodín
      Adresa: ${address}
      Cena: ${price} €
      Popis: ${description}
      
      Kontaktné Údaje Pracovníka
      Meno: ${workerFirstName}
      Priezvisko: ${workerLastName}
      Email: ${workerEmail}
      
      Ak budete mať akékoľvek otázky, neváhajte nás kontaktovať.
      © 2024 SpravToZaMňa. Všetky práva vyhradené.
    `;

  await sendEmail({
    to: creatorEmail,
    subject: "Nový Pracovník sa Zapísal na Vašu Prácu",
    text: textContent,
    html: htmlContent,
    attachments: [
      {
        filename: "LOGO.jpg",
        path: path.join(__dirname, "./assets/LOGO.jpg"),
        cid: "logo",
      },
    ],
  });
};
// Template for confirming worker has been chosen for a job
export const sendWorkerConfirmationEmail = async (
  workerDetails,
  jobDetails
) => {
  const {
    email: workerEmail,
    firstName: workerFirstName,
    lastName: workerLastName,
  } = workerDetails;

  const {
    title,
    category,
    estimatedTime,
    address,
    price,
    jobNumber,
    description,
    creatorFirstName,
    creatorLastName,
    creatorPhoneNumber,
    creatorEmail,
  } = jobDetails;

  const htmlContent = `
      <!DOCTYPE html>
      <html lang="sk">
      <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <style>
              body {
                  font-family: Arial, sans-serif;
                  background-color: #f4f4f4;
                  margin: 0;
                  padding: 0;
                  color: #333333;
              }
              .container {
                  width: 100%;
                  max-width: 600px;
                  margin: 0 auto;
                  background-color: #ffffff;
                  padding: 20px;
                  border: 1px solid #dddddd;
              }
              .header {
                  text-align: center;
                  padding: 10px 0;
              }
              .header img {
                  width: 250px;
              }
              .content {
                  padding: 20px;
              }
              .content h1 {
                  font-size: 24px;
                  color: #333333;
              }
              .content p {
                  font-size: 16px;
                  color: #333333;
                  line-height: 1.5;
              }
              .details {
                  margin: 20px 0;
                  border-top: 1px solid #dddddd;
                  padding: 20px 0;
              }
              .details h2 {
                  font-size: 18px;
                  color: #333333;
              }
              .details table {
                  width: 100%;
                  border-collapse: collapse;
              }
              .details table th,
              .details table td {
                  text-align: left;
                  padding: 10px;
                  border: 1px solid #dddddd;
                  color: #333333;
              }
              .details table th {
                  background-color: #f4f4f4;
              }
              .footer {
                  text-align: center;
                  padding: 20px;
                  font-size: 14px;
                  color: #666666;
              }
          </style>
      </head>
      <body>
          <div class="container">
              <div class="header">
                  <img src="cid:logo" alt="Logo">
              </div>
              <div class="content">
                  <h1>Boli Ste Vybraný Pre Prácu</h1>
                  <p>Ahoj ${workerFirstName},</p>
                  <p>Boli ste vybraný na nasledujúcu prácu:</p>
                  <div class="details">
                      <h2>Podrobnosti Práce</h2>
                      <table>
                          <tr>
                              <th>Číslo Práce</th>
                              <td>${jobNumber}</td>
                          </tr>
                          <tr>
                              <th>Názov</th>
                              <td>${title}</td>
                          </tr>
                          <tr>
                              <th>Kategória</th>
                              <td>${category}</td>
                          </tr>
                          <tr>
                              <th>Odhadovaný Čas</th>
                              <td>${estimatedTime} hodín</td>
                          </tr>
                          <tr>
                              <th>Adresa</th>
                              <td>${address}</td>
                          </tr>
                          <tr>
                              <th>Cena</th>
                              <td>${price} €</td>
                          </tr>
                          <tr>
                              <th>Popis</th>
                              <td>${description}</td>
                          </tr>
                      </table>
                  </div>
                  <div class="details">
                      <h2>Kontaktné Údaje Tvorcu</h2>
                      <table>
                          <tr>
                              <th>Meno</th>
                              <td>${creatorFirstName}</td>
                          </tr>
                          <tr>
                              <th>Priezvisko</th>
                              <td>${creatorLastName}</td>
                          </tr>
                          <tr>
                              <th>Telefónne Číslo</th>
                              <td>${creatorPhoneNumber}</td>
                          </tr>
                          <tr>
                              <th>Email</th>
                              <td>${creatorEmail}</td>
                          </tr>
                      </table>
                  </div>
                  <p style="margin-top: 8px;"><strong style="font-size: 14px;">Ďakujeme, že ste sa zapísali na túto prácu. Ďalšie podrobnosti nájdete vo vašom profile.</strong></p>
              </div>
              <div class="footer">
                  <p>&copy; 2024 SpravToZaMňa. Všetky práva vyhradené.</p>
              </div>
          </div>
      </body>
      </html>
    `;

  const textContent = `
      Boli Ste Vybraný Pre Prácu
      Ahoj ${workerFirstName},
      Boli ste vybraný na nasledujúcu prácu:
      
      Podrobnosti Práce
      Číslo Práce: ${jobNumber}
      Názov: ${title}
      Kategória: ${category}
      Odhadovaný Čas: ${estimatedTime} hodín
      Adresa: ${address}
      Cena: ${price} €
      Popis: ${description}
      
      Kontaktné Údaje Tvorcu
      Meno: ${creatorFirstName}
      Priezvisko: ${creatorLastName}
      Telefónne Číslo: ${creatorPhoneNumber}
      Email: ${creatorEmail}
      
      Ďakujeme, že ste sa zapísali na túto prácu. Ďalšie podrobnosti nájdete vo vašom profile.
      © 2024 SpravToZaMňa. Všetky práva vyhradené.
    `;

  await sendEmail({
    to: workerEmail,
    subject: "Boli Ste Vybraný Pre Prácu",
    text: textContent,
    html: htmlContent,
    attachments: [
      {
        filename: "LOGO.jpg",
        path: path.join(__dirname, "./assets/LOGO.jpg"),
        cid: "logo",
      },
    ],
  });
};
export const sendWorkerConfirmedAndPaymentIntentEmail = async (
  creatorDetails,
  workerDetails,
  jobDetails,
  paymentIntent
) => {
  const { email, firstName, lastName } = creatorDetails;

  const {
    firstName: workerFirstName,
    lastName: workerLastName,
    email: workerEmail,
  } = workerDetails;

  const {
    title,
    category,
    estimatedTime,
    address,
    price,
    jobNumber,
    description,
    creatorFirstName,
  } = jobDetails;

  const htmlContent = `
      <!DOCTYPE html>
      <html lang="sk">
      <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <style>
              body {
                  font-family: Arial, sans-serif;
                  background-color: #f4f4f4;
                  margin: 0;
                  padding: 0;
                  color: #333333;
              }
              .container {
                  width: 100%;
                  max-width: 600px;
                  margin: 0 auto;
                  background-color: #ffffff;
                  padding: 20px;
                  border: 1px solid #dddddd;
              }
              .header {
                  text-align: center;
                  padding: 10px 0;
              }
              .header img {
                  width: 250px;
              }
              .content {
                  padding: 20px;
              }
              .content h1 {
                  font-size: 24px;
                  color: #333333;
              }
              .content p {
                  font-size: 16px;
                  color: #333333;
                  line-height: 1.5;
              }
              .details {
                  margin: 20px 0;
                  border-top: 1px solid #dddddd;
                  padding: 20px 0;
              }
              .details h2 {
                  font-size: 18px;
                  color: #333333;
              }
              .details table {
                  width: 100%;
                  border-collapse: collapse;
              }
              .details table th,
              .details table td {
                  text-align: left;
                  padding: 10px;
                  border: 1px solid #dddddd;
                  color: #333333;
              }
              .details table th {
                  background-color: #f4f4f4;
              }
              .footer {
                  text-align: center;
                  padding: 20px;
                  font-size: 14px;
                  color: #666666;
              }
          </style>
      </head>
      <body>
          <div class="container">
              <div class="header">
                  <img src="cid:logo" alt="Logo">
              </div>
              <div class="content">
                  <h1>Potvrdenie Pracovníka a Platobný Zámysel</h1>
                  <p>Ahoj ${creatorFirstName || firstName},</p>
                  <p>Nasledujúci pracovník bol úspešne potvrdený pre vašu prácu:</p>
                  <div class="details">
                      <h2>Detaily Pracovníka</h2>
                      <table>
                          <tr>
                              <th>Meno</th>
                              <td>${workerFirstName}</td>
                          </tr>
                          <tr>
                              <th>Priezvisko</th>
                              <td>${workerLastName}</td>
                          </tr>
                          <tr>
                              <th>Email</th>
                              <td>${workerEmail}</td>
                          </tr>
                      </table>
                  </div>
                  <div class="details">
                      <h2>Podrobnosti Práce</h2>
                      <table>
                          <tr>
                              <th>Číslo Práce</th>
                              <td>${jobNumber}</td>
                          </tr>
                          <tr>
                              <th>Názov</th>
                              <td>${title}</td>
                          </tr>
                          <tr>
                              <th>Kategória</th>
                              <td>${category}</td>
                          </tr>
                          <tr>
                              <th>Odhadovaný Čas</th>
                              <td>${estimatedTime} hodín</td>
                          </tr>
                          <tr>
                              <th>Adresa</th>
                              <td>${address}</td>
                          </tr>
                          <tr>
                              <th>Cena</th>
                              <td>${price} €</td>
                          </tr>
                          <tr>
                              <th>Popis</th>
                              <td>${description}</td>
                          </tr>
                      </table>
                  </div>
                  <div class="details">
                      <h2>Podrobnosti Platby</h2>
                      <table>
                          <tr>
                              <th>Platobný Zámysel ID</th>
                              <td>${paymentIntent.id}</td>
                          </tr>
                          <tr>
                              <th>Suma</th>
                              <td>${(paymentIntent.amount / 100).toFixed(
                                2
                              )} €</td>
                          </tr>
                          <tr>
                              <th>Mena</th>
                              <td>${paymentIntent.currency.toUpperCase()}</td>
                          </tr>
                          <tr>
                              <th>Klientské Tajomstvo</th>
                              <td>${paymentIntent.client_secret}</td>
                          </tr>
                      </table>
                  </div>
                  <p><strong>Platba bola úspešne autorizovaná a čaká na potvrdenie po dokončení práce.</strong></p>
              </div>
              <div class="footer">
                  <p>&copy; 2024 SpravToZaMňa. Všetky práva vyhradené.</p>
              </div>
          </div>
      </body>
      </html>
    `;

  const textContent = `
      Potvrdenie Pracovníka a Platobný Zámysel
      Ahoj ${creatorFirstName || firstName},
      Nasledujúci pracovník bol úspešne potvrdený pre vašu prácu:
      
      Detaily Pracovníka
      Meno: ${workerFirstName}
      Priezvisko: ${workerLastName}
      Email: ${workerEmail}
      
      Podrobnosti Práce
      Číslo Práce: ${jobNumber}
      Názov: ${title}
      Kategória: ${category}
      Odhadovaný Čas: ${estimatedTime} hodín
      Adresa: ${address}
      Cena: ${price} €
      Popis: ${description}
      
      Podrobnosti Platby
      Platobný Zámysel ID: ${paymentIntent.id}
      Suma: ${(paymentIntent.amount / 100).toFixed(2)} €
      Mena: ${paymentIntent.currency.toUpperCase()}
      Klientské Tajomstvo: ${paymentIntent.client_secret}
      
      Platba bola úspešne autorizovaná a čaká na potvrdenie po dokončení práce.
      
      Ďakujeme, že ste využili naše služby!
      © 2024 SpravToZaMňa. Všetky práva vyhradené.
    `;

  await sendEmail({
    to: email,
    subject: "Potvrdenie Pracovníka a Platobný Zámysel",
    text: textContent,
    html: htmlContent,
    attachments: [
      {
        filename: "LOGO.jpg",
        path: path.join(__dirname, "./assets/LOGO.jpg"),
        cid: "logo",
      },
    ],
  });
};

//email ked worker potvrdi dokoncenie prace
export const sendWorkerCompletionConfirmationEmail = async (
  workerDetails,
  jobDetails,
  workerConfirmation
) => {
  const { email, firstName, lastName } = workerDetails;

  const {
    title,
    category,
    estimatedTime,
    address,
    price,
    jobNumber,
    description,
  } = jobDetails;

  const { workDate, workTime, comment, success } = workerConfirmation;

  const htmlContent = `
      <!DOCTYPE html>
      <html lang="sk">
      <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <style>
              body {
                  font-family: Arial, sans-serif;
                  background-color: #f4f4f4;
                  margin: 0;
                  padding: 0;
                  color: #333333;
              }
              .container {
                  width: 100%;
                  max-width: 600px;
                  margin: 0 auto;
                  background-color: #ffffff;
                  padding: 20px;
                  border: 1px solid #dddddd;
              }
              .header {
                  text-align: center;
                  padding: 10px 0;
              }
              .header img {
                  width: 250px;
              }
              .content {
                  padding: 20px;
              }
              .content h1 {
                  font-size: 24px;
                  color: #333333;
              }
              .content p {
                  font-size: 16px;
                  color: #333333;
                  line-height: 1.5;
              }
              .details {
                  margin: 20px 0;
                  border-top: 1px solid #dddddd;
                  padding: 20px 0;
              }
              .details h2 {
                  font-size: 18px;
                  color: #333333;
              }
              .details table {
                  width: 100%;
                  border-collapse: collapse;
              }
              .details table th,
              .details table td {
                  text-align: left;
                  padding: 10px;
                  border: 1px solid #dddddd;
                  color: #333333;
              }
              .details table th {
                  background-color: #f4f4f4;
              }
              .footer {
                  text-align: center;
                  padding: 20px;
                  font-size: 14px;
                  color: #666666;
              }
          </style>
      </head>
      <body>
          <div class="container">
              <div class="header">
                  <img src="cid:logo" alt="Logo">
              </div>
              <div class="content">
                  <h1>Potvrdenie o Dokončení Práce</h1>
                  <p>Ahoj ${firstName},</p>
                  <p>Potvrdili ste dokončenie nasledujúcej práce:</p>
                  <div class="details">
                      <h2>Podrobnosti Práce</h2>
                      <table>
                          <tr>
                              <th>Číslo Práce</th>
                              <td>${jobNumber}</td>
                          </tr>
                          <tr>
                              <th>Názov</th>
                              <td>${title}</td>
                          </tr>
                          <tr>
                              <th>Kategória</th>
                              <td>${category}</td>
                          </tr>
                          <tr>
                              <th>Odhadovaný Čas</th>
                              <td>${estimatedTime} hodín</td>
                          </tr>
                          <tr>
                              <th>Adresa</th>
                              <td>${address}</td>
                          </tr>
                          <tr>
                              <th>Cena</th>
                              <td>${price} €</td>
                          </tr>
                          <tr>
                              <th>Popis</th>
                              <td>${description}</td>
                          </tr>
                      </table>
                  </div>
                  <div class="details">
                      <h2>Vaše Potvrdenie</h2>
                      <table>
                          <tr>
                              <th>Dátum Práce</th>
                              <td>${workDate}</td>
                          </tr>
                          <tr>
                              <th>Čas Práce</th>
                              <td>${workTime}</td>
                          </tr>
                          <tr>
                              <th>Komentár</th>
                              <td>${comment}</td>
                          </tr>
                          <tr>
                              <th>Status</th>
                              <td>${success ? "Úspešné" : "Neúspešné"}</td>
                          </tr>
                      </table>
                  </div>
              </div>
              <div class="footer">
                  <p>&copy; 2024 SpravToZaMňa. Všetky práva vyhradené.</p>
              </div>
          </div>
      </body>
      </html>
    `;

  const textContent = `
      Potvrdenie o Dokončení Práce
      Ahoj ${firstName},
      Potvrdili ste dokončenie nasledujúcej práce:
      
      Podrobnosti Práce
      Číslo Práce: ${jobNumber}
      Názov: ${title}
      Kategória: ${category}
      Odhadovaný Čas: ${estimatedTime} hodín
      Adresa: ${address}
      Cena: ${price} €
      Popis: ${description}
      
      Vaše Potvrdenie
      Dátum Práce: ${workDate}
      Čas Práce: ${workTime}
      Komentár: ${comment}
      Status: ${success ? "Úspešné" : "Neúspešné"}
      
      Ďakujeme, že ste využili naše služby!
      © 2024 SpravToZaMňa. Všetky práva vyhradené.
    `;

  await sendEmail({
    to: email,
    subject: "Potvrdenie o Dokončení Práce",
    text: textContent,
    html: htmlContent,
    attachments: [
      {
        filename: "LOGO.jpg",
        path: path.join(__dirname, "./assets/LOGO.jpg"),
        cid: "logo",
      },
    ],
  });
};

//email pre creatora, ze worker potvrdil dokoncenie
export const sendCreatorNotificationEmail = async (
  workerDetails,
  jobDetails,
  workerConfirmation
) => {
  const { workDate, workTime, comment, success } = workerConfirmation;

  const {
    firstName: workerFirstName,
    lastName: workerLastName,
    email: workerEmail,
  } = workerDetails;

  const {
    title,
    category,
    estimatedTime,
    address,
    price,
    jobNumber,
    description,
    creatorFirstName,
    creatorEmail,
  } = jobDetails;

  const htmlContent = `
      <!DOCTYPE html>
      <html lang="sk">
      <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <style>
              body {
                  font-family: Arial, sans-serif;
                  background-color: #f4f4f4;
                  margin: 0;
                  padding: 0;
                  color: #333333;
              }
              .container {
                  width: 100%;
                  max-width: 600px;
                  margin: 0 auto;
                  background-color: #ffffff;
                  padding: 20px;
                  border: 1px solid #dddddd;
              }
              .header {
                  text-align: center;
                  padding: 10px 0;
              }
              .header img {
                  width: 250px;
              }
              .content {
                  padding: 20px;
              }
              .content h1 {
                  font-size: 24px;
                  color: #333333;
              }
              .content p {
                  font-size: 16px;
                  color: #333333;
                  line-height: 1.5;
              }
              .details {
                  margin: 20px 0;
                  border-top: 1px solid #dddddd;
                  padding: 20px 0;
              }
              .details h2 {
                  font-size: 18px;
                  color: #333333;
              }
              .details table {
                  width: 100%;
                  border-collapse: collapse;
              }
              .details table th,
              .details table td {
                  text-align: left;
                  padding: 10px;
                  border: 1px solid #dddddd;
                  color: #333333;
              }
              .details table th {
                  background-color: #f4f4f4;
              }
              .footer {
                  text-align: center;
                  padding: 20px;
                  font-size: 14px;
                  color: #666666;
              }
          </style>
      </head>
      <body>
          <div class="container">
              <div class="header">
                  <img src="cid:logo" alt="Logo">
              </div>
              <div class="content">
                  <h1>Potvrdenie Pracovníka</h1>
                  <p>Ahoj ${creatorFirstName},</p>
                  <p>Pracovník ${workerFirstName} ${workerLastName} potvrdil dokončenie nasledujúcej práce:</p>
                  <div class="details">
                      <h2>Podrobnosti Práce</h2>
                      <table>
                          <tr>
                              <th>Číslo Práce</th>
                              <td>${jobNumber}</td>
                          </tr>
                          <tr>
                              <th>Názov</th>
                              <td>${title}</td>
                          </tr>
                          <tr>
                              <th>Kategória</th>
                              <td>${category}</td>
                          </tr>
                          <tr>
                              <th>Odhadovaný Čas</th>
                              <td>${estimatedTime} hodín</td>
                          </tr>
                          <tr>
                              <th>Adresa</th>
                              <td>${address}</td>
                          </tr>
                          <tr>
                              <th>Cena</th>
                              <td>${price} €</td>
                          </tr>
                          <tr>
                              <th>Popis</th>
                              <td>${description}</td>
                          </tr>
                      </table>
                  </div>
                  <div class="details">
                      <h2>Detaily Pracovníka</h2>
                      <table>
                          <tr>
                              <th>Meno</th>
                              <td>${workerFirstName}</td>
                          </tr>
                          <tr>
                              <th>Priezvisko</th>
                              <td>${workerLastName}</td>
                          </tr>
                          <tr>
                              <th>Email</th>
                              <td>${workerEmail}</td>
                          </tr>
                      </table>
                  </div>
                  <div class="details">
                      <h2>Potvrdenie Práce</h2>
                      <table>
                          <tr>
                              <th>Dátum Práce</th>
                              <td>${workDate}</td>
                          </tr>
                          <tr>
                              <th>Čas Práce</th>
                              <td>${workTime}</td>
                          </tr>
                          <tr>
                              <th>Komentár</th>
                              <td>${comment}</td>
                          </tr>
                          <tr>
                              <th>Status</th>
                              <td>${success ? "Úspešné" : "Neúspešné"}</td>
                          </tr>
                      </table>
                  </div>
                  <p><strong>Prosím, taktiež potvrďte dokončenie práce, ak ste ešte tak neurobili.</strong></p>
              </div>
              <div class="footer">
                  <p>&copy; 2024 SpravToZaMňa. Všetky práva vyhradené.</p>
              </div>
          </div>
      </body>
      </html>
    `;

  const textContent = `
      Potvrdenie Pracovníka
      Ahoj ${creatorFirstName},
      Pracovník ${workerFirstName} ${workerLastName} potvrdil dokončenie nasledujúcej práce:
      
      Podrobnosti Práce
      Číslo Práce: ${jobNumber}
      Názov: ${title}
      Kategória: ${category}
      Odhadovaný Čas: ${estimatedTime} hodín
      Adresa: ${address}
      Cena: ${price} €
      Popis: ${description}
      
      Detaily Pracovníka
      Meno: ${workerFirstName}
      Priezvisko: ${workerLastName}
      Email: ${workerEmail}
      
      Potvrdenie Práce
      Dátum Práce: ${workDate}
      Čas Práce: ${workTime}
      Komentár: ${comment}
      Status: ${success ? "Úspešné" : "Neúspešné"}
      
      Prosím, taktiež potvrďte dokončenie práce, ak ste ešte tak neurobili.
      
      Ďakujeme, že ste využili naše služby!
      © 2024 SpravToZaMňa. Všetky práva vyhradené.
    `;

  await sendEmail({
    to: creatorEmail,
    subject: "Potvrdenie Pracovníka",
    text: textContent,
    html: htmlContent,
    attachments: [
      {
        filename: "LOGO.jpg",
        path: path.join(__dirname, "./assets/LOGO.jpg"),
        cid: "logo",
      },
    ],
  });
};
export const sendCreatorCompletionConfirmationEmail = async (
  creatorDetails,
  jobDetails,
  creatorConfirmation
) => {
  const { comment, rating, success } = creatorConfirmation;

  const { firstName: creatorFirstName, email: creatorEmail } = creatorDetails;

  const {
    title,
    category,
    estimatedTime,
    address,
    price,
    jobNumber,
    description,
  } = jobDetails;

  const htmlContent = `
      <!DOCTYPE html>
      <html lang="sk">
      <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <style>
              body {
                  font-family: Arial, sans-serif;
                  background-color: #f4f4f4;
                  margin: 0;
                  padding: 0;
                  color: #333333;
              }
              .container {
                  width: 100%;
                  max-width: 600px;
                  margin: 0 auto;
                  background-color: #ffffff;
                  padding: 20px;
                  border: 1px solid #dddddd;
              }
              .header {
                  text-align: center;
                  padding: 10px 0;
              }
              .header img {
                  width: 250px;
              }
              .content {
                  padding: 20px;
              }
              .content h1 {
                  font-size: 24px;
                  color: #333333;
              }
              .content p {
                  font-size: 16px;
                  color: #333333;
                  line-height: 1.5;
              }
              .details {
                  margin: 20px 0;
                  border-top: 1px solid #dddddd;
                  padding: 20px 0;
              }
              .details h2 {
                  font-size: 18px;
                  color: #333333;
              }
              .details table {
                  width: 100%;
                  border-collapse: collapse;
              }
              .details table th,
              .details table td {
                  text-align: left;
                  padding: 10px;
                  border: 1px solid #dddddd;
                  color: #333333;
              }
              .details table th {
                  background-color: #f4f4f4;
              }
              .footer {
                  text-align: center;
                  padding: 20px;
                  font-size: 14px;
                  color: #666666;
              }
          </style>
      </head>
      <body>
          <div class="container">
              <div class="header">
                  <img src="cid:logo" alt="Logo">
              </div>
              <div class="content">
                  <h1>Potvrdenie Dokončenia Práce</h1>
                  <p>Ahoj ${creatorFirstName},</p>
                  <p>Potvrdili ste dokončenie nasledujúcej práce:</p>
                  <div class="details">
                      <h2>Podrobnosti Práce</h2>
                      <table>
                          <tr>
                              <th>Číslo Práce</th>
                              <td>${jobNumber}</td>
                          </tr>
                          <tr>
                              <th>Názov</th>
                              <td>${title}</td>
                          </tr>
                          <tr>
                              <th>Kategória</th>
                              <td>${category}</td>
                          </tr>
                          <tr>
                              <th>Odhadovaný Čas</th>
                              <td>${estimatedTime} hodín</td>
                          </tr>
                          <tr>
                              <th>Adresa</th>
                              <td>${address}</td>
                          </tr>
                          <tr>
                              <th>Cena</th>
                              <td>${price} €</td>
                          </tr>
                          <tr>
                              <th>Popis</th>
                              <td>${description}</td>
                          </tr>
                      </table>
                  </div>
                  <div class="details">
                      <h2>Vaše Potvrdenie</h2>
                      <table>
                          <tr>
                              <th>Komentár</th>
                              <td>${comment}</td>
                          </tr>
                          <tr>
                              <th>Hodnotenie</th>
                              <td>${rating}</td>
                          </tr>
                          <tr>
                              <th>Status</th>
                              <td>${success ? "Úspešné" : "Neúspešné"}</td>
                          </tr>
                      </table>
                  </div>
                  <p><strong>Ďakujeme, že ste využili naše služby!</strong></p>
              </div>
              <div class="footer">
                  <p>&copy; 2024 SpravToZaMňa. Všetky práva vyhradené.</p>
              </div>
          </div>
      </body>
      </html>
    `;

  const textContent = `
      Potvrdenie Dokončenia Práce
      Ahoj ${creatorFirstName},
      Potvrdili ste dokončenie nasledujúcej práce:
      
      Podrobnosti Práce
      Číslo Práce: ${jobNumber}
      Názov: ${title}
      Kategória: ${category}
      Odhadovaný Čas: ${estimatedTime} hodín
      Adresa: ${address}
      Cena: ${price} €
      Popis: ${description}
      
      Vaše Potvrdenie
      Komentár: ${comment}
      Hodnotenie: ${rating}
      Status: ${success ? "Úspešné" : "Neúspešné"}
      
      Ďakujeme, že ste využili naše služby!
      © 2024 SpravToZaMňa. Všetky práva vyhradené.
    `;

  await sendEmail({
    to: creatorEmail,
    subject: "Potvrdenie Dokončenia Práce",
    text: textContent,
    html: htmlContent,
    attachments: [
      {
        filename: "LOGO.jpg",
        path: path.join(__dirname, "./assets/LOGO.jpg"),
        cid: "logo",
      },
    ],
  });
};
export const sendWorkerCompletionNotificationEmail = async (
  workerDetails,
  jobDetails,
  creatorConfirmation
) => {
  const { email, firstName } = workerDetails;

  const {
    title,
    category,
    estimatedTime,
    address,
    price,
    jobNumber,
    description,
  } = jobDetails;

  const { comment, rating, success } = creatorConfirmation;

  const htmlContent = `
      <!DOCTYPE html>
      <html lang="sk">
      <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <style>
              body {
                  font-family: Arial, sans-serif;
                  background-color: #f4f4f4;
                  margin: 0;
                  padding: 0;
                  color: #333333;
              }
              .container {
                  width: 100%;
                  max-width: 600px;
                  margin: 0 auto;
                  background-color: #ffffff;
                  padding: 20px;
                  border: 1px solid #dddddd;
              }
              .header {
                  text-align: center;
                  padding: 10px 0;
              }
              .header img {
                  width: 250px;
              }
              .content {
                  padding: 20px;
              }
              .content h1 {
                  font-size: 24px;
                  color: #333333;
              }
              .content p {
                  font-size: 16px;
                  color: #333333;
                  line-height: 1.5;
              }
              .details {
                  margin: 20px 0;
                  border-top: 1px solid #dddddd;
                  padding: 20px 0;
              }
              .details h2 {
                  font-size: 18px;
                  color: #333333;
              }
              .details table {
                  width: 100%;
                  border-collapse: collapse;
              }
              .details table th,
              .details table td {
                  text-align: left;
                  padding: 10px;
                  border: 1px solid #dddddd;
                  color: #333333;
              }
              .details table th {
                  background-color: #f4f4f4;
              }
              .footer {
                  text-align: center;
                  padding: 20px;
                  font-size: 14px;
                  color: #666666;
              }
          </style>
      </head>
      <body>
          <div class="container">
              <div class="header">
                  <img src="cid:logo" alt="Logo">
              </div>
              <div class="content">
                  <h1>Potvrdenie od Tvorcu Prace</h1>
                  <p>Ahoj ${firstName},</p>
                  <p>Nasledujúca práca bola potvrdená jej tvorcom:</p>
                  <div class="details">
                      <h2>Podrobnosti Práce</h2>
                      <table>
                          <tr>
                              <th>Číslo Práce</th>
                              <td>${jobNumber}</td>
                          </tr>
                          <tr>
                              <th>Názov</th>
                              <td>${title}</td>
                          </tr>
                          <tr>
                              <th>Kategória</th>
                              <td>${category}</td>
                          </tr>
                          <tr>
                              <th>Odhadovaný Čas</th>
                              <td>${estimatedTime} hodín</td>
                          </tr>
                          <tr>
                              <th>Adresa</th>
                              <td>${address}</td>
                          </tr>
                          <tr>
                              <th>Cena</th>
                              <td>${price} €</td>
                          </tr>
                          <tr>
                              <th>Popis</th>
                              <td>${description}</td>
                          </tr>
                      </table>
                  </div>
                  <div class="details">
                      <h2>Potvrdenie Vytvoriteľa</h2>
                      <table>
                          <tr>
                              <th>Komentár</th>
                              <td>${comment}</td>
                          </tr>
                          <tr>
                              <th>Hodnotenie</th>
                              <td>${rating} / 5</td>
                          </tr>
                          <tr>
                              <th>Stav</th>
                              <td>${success ? "Úspešná" : "Neúspešná"}</td>
                          </tr>
                      </table>
                  </div>
                  <p><strong>Ak ste zatiaľ nepotvrdili dokončenie práce, prosím, urobte tak čo najskôr.</strong></p>
              </div>
              <div class="footer">
                  <p>&copy; 2024 SpravToZaMňa. Všetky práva vyhradené.</p>
              </div>
          </div>
      </body>
      </html>
    `;

  const textContent = `
      Potvrdenie od Vytvoriteľa
      Ahoj ${firstName},
      Nasledujúca práca bola potvrdená jej vytvoriteľom:
      
      Podrobnosti Práce
      Číslo Práce: ${jobNumber}
      Názov: ${title}
      Kategória: ${category}
      Odhadovaný Čas: ${estimatedTime} hodín
      Adresa: ${address}
      Cena: ${price} €
      Popis: ${description}
      
      Potvrdenie Vytvoriteľa
      Komentár: ${comment}
      Hodnotenie: ${rating} / 5
      Stav: ${success ? "Úspešná" : "Neúspešná"}
      
      Ak ste zatiaľ nepotvrdili dokončenie práce, prosím, urobte tak čo najskôr.
      
      Ďakujeme, že ste využili naše služby!
      © 2024 SpravToZaMňa. Všetky práva vyhradené.
    `;

  await sendEmail({
    to: email,
    subject: "Potvrdenie od Vytvoriteľa",
    text: textContent,
    html: htmlContent,
    attachments: [
      {
        filename: "LOGO.jpg",
        path: path.join(__dirname, "./assets/LOGO.jpg"),
        cid: "logo",
      },
    ],
  });
};

export const sendCompletionStatusEmail = async (
  creatorDetails,
  workerDetails,
  jobDetails,
  creatorConfirmation,
  workerConfirmation,
  jobStatus
) => {
  const { firstName: creatorFirstName, email: creatorEmail } = creatorDetails;
  const { firstName: workerFirstName, email: workerEmail } = workerDetails;
  const {
    title,
    category,
    estimatedTime,
    address,
    price,
    jobNumber,
    description,
  } = jobDetails;
  const {
    comment: creatorComment,
    rating: creatorRating,
    success: creatorSuccess,
  } = creatorConfirmation;
  const {
    comment: workerComment,
    rating: workerRating,
    success: workerSuccess,
  } = workerConfirmation;

  let moneyMessage;
  let statusMessage;
  if (jobStatus === "successful") {
    statusMessage = "Práca bola úspešne dokončená.";
    moneyMessage =
      "Peniaze za prácu boli odoslané pracovníkovi na účet. Môže to trvať niekoľko dní.";
  } else if (jobStatus === "unsuccessful") {
    statusMessage = "Práca bola neúspešná.";
    moneyMessage =
      "Peniaze za prácu boli vrátené tvorcovi práce na účet. Môže to trvať niekoľko dní.";
  } else if (jobStatus === "dispute") {
    statusMessage = "Práca je v spore a vyžaduje manuálny zásah.";
    moneyMessage =
      "Táto práca bude preskúmavaná naším admin tímom, pre urýchlenie tohto procesu nás kontaktujte mailom.";
  }

  const htmlContent = `
      <!DOCTYPE html>
      <html lang="sk">
      <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <style>
              body {
                  font-family: Arial, sans-serif;
                  background-color: #f4f4f4;
                  margin: 0;
                  padding: 0;
                  color: #333333;
              }
              .container {
                  width: 100%;
                  max-width: 600px;
                  margin: 0 auto;
                  background-color: #ffffff;
                  padding: 20px;
                  border: 1px solid #dddddd;
              }
              .header {
                  text-align: center;
                  padding: 10px 0;
              }
              .header img {
                  width: 250px;
              }
              .content {
                  padding: 20px;
              }
              .content h1 {
                  font-size: 24px;
                  color: #333333;
              }
              .content p {
                  font-size: 16px;
                  color: #333333;
                  line-height: 1.5;
              }
              .details {
                  margin: 20px 0;
                  border-top: 1px solid #dddddd;
                  padding: 20px 0;
              }
              .details h2 {
                  font-size: 18px;
                  color: #333333;
              }
              .details table {
                  width: 100%;
                  border-collapse: collapse;
              }
              .details table th,
              .details table td {
                  text-align: left;
                  padding: 10px;
                  border: 1px solid #dddddd;
                  color: #333333;
              }
              .details table th {
                  background-color: #f4f4f4;
              }
              .footer {
                  text-align: center;
                  padding: 20px;
                  font-size: 14px;
                  color: #666666;
              }
          </style>
      </head>
      <body>
          <div class="container">
              <div class="header">
                  <img src="cid:logo" alt="Logo">
              </div>
              <div class="content">
                  <h1>Stav Práce</h1>
                  <p>${statusMessage}</p>
                  <p>${moneyMessage}</p>
                  <div class="details">
                      <h2>Podrobnosti Práce</h2>
                      <table>
                          <tr>
                              <th>Číslo Práce</th>
                              <td>${jobNumber}</td>
                          </tr>
                          <tr>
                              <th>Názov</th>
                              <td>${title}</td>
                          </tr>
                          <tr>
                              <th>Kategória</th>
                              <td>${category}</td>
                          </tr>
                          <tr>
                              <th>Odhadovaný Čas</th>
                              <td>${estimatedTime} hodín</td>
                          </tr>
                          <tr>
                              <th>Adresa</th>
                              <td>${address}</td>
                          </tr>
                          <tr>
                              <th>Cena</th>
                              <td>${price} €</td>
                          </tr>
                          <tr>
                              <th>Popis</th>
                              <td>${description}</td>
                          </tr>
                      </table>
                  </div>
                  <div class="details">
                      <h2>Potvrdenie Tvorcu práce</h2>
                      <table>
                          <tr>
                              <th>Komentár</th>
                              <td>${creatorComment}</td>
                          </tr>
                          <tr>
                              <th>Rating</th>
                              <td>${creatorRating}</td>
                          </tr>
                          <tr>
                              <th>Úspech</th>
                              <td>${creatorSuccess ? "Áno" : "Nie"}</td>
                          </tr>
                      </table>
                  </div>
                  <div class="details">
                      <h2>Potvrdenie od Pracovníka</h2>
                      <table>
                          <tr>
                              <th>Komentár</th>
                              <td>${workerComment}</td>
                          </tr>
                          <tr>
                              <th>Rating</th>
                              <td>${workerRating}</td>
                          </tr>
                          <tr>
                              <th>Úspech</th>
                              <td>${workerSuccess ? "Áno" : "Nie"}</td>
                          </tr>
                      </table>
                  </div>
              </div>
              <div class="footer">
                  <p>&copy; 2024 SpravToZaMňa. Všetky práva vyhradené.</p>
              </div>
          </div>
      </body>
      </html>
    `;

  const textContent = `
      Stav Práce
      ${statusMessage}
  
      Podrobnosti Práce
      Číslo Práce: ${jobNumber}
      Názov: ${title}
      Kategória: ${category}
      Odhadovaný Čas: ${estimatedTime} hodín
      Adresa: ${address}
      Cena: ${price} €
      Popis: ${description}
  
      Potvrdenie Creatora
      Komentár: ${creatorComment}
      Rating: ${creatorRating}
      Úspech: ${creatorSuccess ? "Áno" : "Nie"}
  
      Potvrdenie Workera
      Komentár: ${workerComment}
      Rating: ${workerRating}
      Úspech: ${workerSuccess ? "Áno" : "Nie"}
  
      Ďakujeme, že ste využili naše služby!
      © 2024 SpravToZaMňa. Všetky práva vyhradené.
    `;

  await sendEmail({
    to: creatorEmail,
    subject: "Stav Práce",
    text: textContent,
    html: htmlContent,
    attachments: [
      {
        filename: "LOGO.jpg",
        path: path.join(__dirname, "./assets/LOGO.jpg"),
        cid: "logo",
      },
    ],
  });

  await sendEmail({
    to: workerEmail,
    subject: "Stav Práce",
    text: textContent,
    html: htmlContent,
    attachments: [
      {
        filename: "LOGO.jpg",
        path: path.join(__dirname, "./assets/LOGO.jpg"),
        cid: "logo",
      },
    ],
  });
};

export const sendWorkerTimeUpdateEmail = async ({
    to,
    firstName,
    lastName,
    jobTitle,
    newProposedDate,
    newProposedTime,
    creatorFirstName,
    creatorLastName,
    creatorPhoneNumber,
    jobUrl,
  }) => {
    // Preformátujeme nový dátum do pekného slovenského formátu, napr. "26. februára 2025"
    const formattedDate = new Date(newProposedDate).toLocaleDateString("sk-SK", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  
    const htmlContent = `
        <!DOCTYPE html>
        <html lang="sk">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <style>
                body {
                    font-family: Arial, sans-serif;
                    background-color: #f4f4f4;
                    margin: 0;
                    padding: 20px;
                    color: #333333;
                }
                .container {
                    max-width: 600px;
                    margin: auto;
                    background-color: #ffffff;
                    padding: 20px;
                    border: 1px solid #dddddd;
                }
                .header {
                    text-align: center;
                    padding: 10px 0;
                }
                .header img {
                    width: 250px;
                }
                .content {
                    padding: 20px 0;
                }
                .content h1 {
                    font-size: 24px;
                    color: #333333;
                }
                .content p {
                    font-size: 16px;
                    line-height: 1.5;
                    color: #333333;
                }
                .details {
                    margin: 20px 0;
                    border-top: 1px solid #dddddd;
                    padding: 20px 0;
                }
                .details h2 {
                    font-size: 18px;
                    color: #333333;
                }
                .details table {
                    width: 100%;
                    border-collapse: collapse;
                }
                .details table th,
                .details table td {
                    text-align: left;
                    padding: 10px;
                    border: 1px solid #dddddd;
                    color: #333333;
                }
                .details table th {
                    background-color: #f4f4f4;
                }
                .link {
                    margin-top: 20px;
                    text-align: center;
                }
                .link a {
                    color: #1a73e8;
                    text-decoration: none;
                    font-weight: bold;
                }
                .footer {
                    text-align: center;
                    padding: 20px;
                    font-size: 14px;
                    color: #666666;
                }
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <img src="cid:logo" alt="Logo">
                </div>
                <div class="content">
                    <h1>Aktualizácia navrhnutého termínu práce</h1>
                    <p>Ahoj ${firstName} ${lastName},</p>
                    <p>
                      Tvorcovi práce nevyhovoval Váš termín pre prácu <strong>${jobTitle}</strong> a preto navrhol nový termín práce.
                      <div class="link">
                      <p>
                          Na prácu sa môžeš znovu prihlásiť kliknutím
                          <a href="${jobUrl}" target="_blank" rel="noopener noreferrer">sem</a>.
                      </p>
                    </div>
                    </p>
                    <div class="details">
                        <h2>Nový termín práce</h2>
                        <table>
                            <tr>
                                <th>Dátum práce</th>
                                <td>${formattedDate}</td>
                            </tr>
                            <tr>
                                <th>Čas práce</th>
                                <td>${newProposedTime}</td>
                            </tr>
                        </table>
                    </div>
                    <div class="details">
                        <h2>Kontaktné údaje zadávateľa</h2>
                        <table>
                            <tr>
                                <th>Meno a priezvisko</th>
                                <td>${creatorFirstName} ${creatorLastName}</td>
                            </tr>
                            <tr>
                                <th>Telefón</th>
                                <td>${creatorPhoneNumber}</td>
                            </tr>
                        </table>
                    </div>
                    
                </div>
                <div class="footer">
                    <p>&copy; 2024 SpravToZaMňa. Všetky práva vyhradené.</p>
                </div>
            </div>
        </body>
        </html>
    `;
  console.log(jobUrl);
    const textContent = `
  Aktualizácia navrhnutého termínu práce
  
  Ahoj ${firstName} ${lastName},
  
  Zadávateľ práce pre ${jobTitle} navrhol nový termín práce.
  
  Dátum práce: ${formattedDate}
  Čas práce: ${newProposedTime}
  
  Kontaktné údaje zadávateľa:
  Meno a priezvisko: ${creatorFirstName} ${creatorLastName}
  Telefón: ${creatorPhoneNumber}
  
  Pre zobrazenie detailov práce navštívte: ${jobUrl}
  
  Ak s tým nesúhlasíte, prosím, kontaktujte zadávateľa.
  
  © 2024 SpravToZaMňa. Všetky práva vyhradené.
    `;
  
    await sendEmail({
      to,
      subject: "Aktualizácia navrhnutého termínu práce",
      text: textContent,
      html: htmlContent,
      attachments: [
        {
          filename: "LOGO.jpg",
          path: path.join(__dirname, "./assets/LOGO.jpg"),
          cid: "logo",
        },
      ],
    });
  };

export default {
  sendEmail,
  welcomeEmailTemplate,
  resetPasswordEmailTemplate,
  sendJobCreationEmail,
  sendWorkerSignupEmail,
  sendWorkerSignupNotificationToCreator,
  sendWorkerConfirmationEmail,
  sendWorkerConfirmedAndPaymentIntentEmail,
  sendWorkerCompletionConfirmationEmail,
  sendCreatorNotificationEmail,
  sendCreatorCompletionConfirmationEmail,
  sendWorkerCompletionNotificationEmail,
  sendCompletionStatusEmail,
  sendWorkerTimeUpdateEmail
  // Other email template functions...
};
