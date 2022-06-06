
# KYOCERA SALES TOOLKIT 1.0.3 Release Notes

## September 11, 2021

## Bug fixes & Features

*  ** TERMS OF USE ** - Added text for terms of use at login page
* **TYPOGRAPHY** - Typography changes applied as described in design changes document. [https://xd.adobe.com/view/843bac2e-c5dd-4be2-afc7-e7329a1554aa-d168/?hints=off]
*  **LAYOUT CORRECTIONS** - Layout paddings, margins and sizes changed as described in the design changes document.
*  **DROPDOWN ICON CLICK EVENT FIX** - New event added to dropdown buttons on “Need”, “Pain” rows. Icons are clickable and  will open card content.
* **LOGIN, GET ACCESS TOKEN (AZURE AD)** - Access and refresh tokens which will authenticate and authorize frontend requests are issued from Azure AD. Detailed in sequence diagram.
* **19 IMPLEMENT JWT TO BACKEND** - JSON Web Token(jwt) authorization system implemented. Whenever users login to Sales Toolkit, an access token will be issued and requests which do not contain a valid access token will be blocked by the backend.
* **GET USER DATA FROM MICROSOFT GRAPH API** - Logged user data such as name, email, user groups are coming from Microsoft’s Graph API. User Roles (User,Admin,Editor) are determined by user groups Role_Salestoolkit-Admin, Role_Salestoolkit-Editor, Role_Salestoolkit-User
* **VERIFY AZURE AD ACCESS TOKEN** - Access token which comes from  each request’s header is verified by using Microsoft’s public keys and hash algorithms. If the token passes the algorithm, the request will be authenticated by the backend.
* **AUTHORIZE REQUESTS** - User role is hashed in the access token. If a request try access to authorized api endpoint and the access token does not include the correct role, the request will be blocked by the backend.
* **SECURITY UPDATES** - Critical information on localStorage of browser are hashed.
  

# KYOCERA SALES TOOLKIT 1.0.2 Release Notes

## September 3, 2021

  

## Bug fixes

*  **No action after clicking Sign in with SSO** - Azure AD users that where not added to an Sales Toolkit group where not able to continue. This has been fixed with showing an error message that they are not eligible for the application. They can Sign out from the application.

  

# KYOCERA SALES TOOLKIT 1.0.1 Release Notes

## September 1, 2021

  

## New Features

*  **Azure AD Integration** - Kyocera employees can login with their Kyocera emails. The users only can use the application when they are eligible. Users from the group **Role_Salestoolkit-Admin**, **Role_Salestoolkit-Editor** and **Role_Salestoolkit-User** can login with their Kyocera account. Users who are not added to one of these groups, will login but cannot use the application.

*  **External Login (Old users)** - Users who logged in before with their email address, can use the **External Login** button on the login page. Nothing is changed for these users.

  

## Bug fixes

* CSS changes have been implemented

* Font size changes

  

# KYOCERA SALES TOOLKIT 1.0.0 Release Notes

## July 13, 2021

  

## New Features

*  **Images for Industries** - The top image will be changed regarding the Industry the user has chosen

*  **Feedback Notification** - When users fill in the Feedback form the admin will be informed that there is an feedback in the portal of the Sales Toolkit.

*  **Google Analytics Implementation** - The Google Analytics script has been added to the Sales Toolkit.

*  **Terms and Conditions pages** - New pages are been added for the Terms and Condition and Privacy statement. Users can open these pages without login.

*  **UI Improvements** - Enhanced user feedback on fauceting.

  

## Bug fixes

* Added meta data for Google Analytics

* Fixed content position

* Pain / Need bold problem solved

* Footer text updated