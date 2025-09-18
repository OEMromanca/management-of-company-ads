## Project Setup

**Clone the repo**

- git clone [<PROJECT_URL>](https://github.com/OEMromanca/management-of-company-ads.git)

**Open the project**

- cd Advertisement-Management-ts-app

**Install dependencies**

- npm i

**Start the project from the root**

- npm run dev

## API Usage

The project uses the following endpoints:

- **GET /search** – search for companies by registration number (ICO) or name.
- **GET /ads** – retrieve a list of all ads (with support for pagination via `page` and `limit`).
- **DELETE /ads/:advertId** – delete an ad by its ID.
- **PUT /:ico/advert** – assign a new ad to a specific company (including uploading a logo via multipart/form-data).
- **PUT /ads/:advertId** – update an ad by its ID.
- **PATCH /ads/top/:advertId** – toggle an ad to _Top_ or back.

### Things to Watch Out For

- **API Rate Limits**  
  The API allows only a limited number of requests per minute. When paginating and making repeated calls, it was necessary to optimize the number of requests.

- **Response Structure**  
  Some fields may be `null` or missing (e.g., `logoBase64`), so checks and fallback values were required.

- **Data Transformation**

  - Dates (`createdAt`) needed to be converted into a readable format.
  - Logos (`logoBase64`) had to be handled carefully since the API returns strings in various formats (`data:image/png;base64,...` or just plain Base64).

- **Image Upload**  
  For `PUT /:ico/advert`, the `multer` middleware (`uploadImage.single("logo")`) is used to upload the logo.

- **File Storage**  
  When generating PDFs, the file name had to be set correctly (e.g., combining the company name and date) and the API data properly decoded.

- **Pagination**  
  The `/ads` endpoint returns only a limited number of records. Therefore, the `page` and `limit` parameters are used to fetch additional data.

- **Fetching Data from the RPO API**  
  To fetch data from the RPO API, a custom function was created that returns data in the desired format and selects only the properties needed for the application. This allowed for easy integration and minimized unnecessary data.

- **FE application**
  The functionality includes adding advertisements, where a modal window opens with a form. In the form, there is the option to search for companies by name or by ICO, add an advertisement and the company logo. A toast notification indicates whether the advertisement was successfully submitted; if not, it returns an error. Furthermore, there is the possibility to edit the advertisement, download a PDF file, mark an advertisement as top, and delete an advertisement. The application also includes pagination.
