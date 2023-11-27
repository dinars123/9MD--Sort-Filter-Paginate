import axios, { AxiosResponse } from 'axios';

const name = document.querySelector('.name') as HTMLDivElement;
const Capital = document.querySelector('.Capital') as HTMLDivElement;
const Currency = document.querySelector('.Currency') as HTMLDivElement;
const Language = document.querySelector('.Language') as HTMLDivElement;
const tableNav = document.querySelector('.tableNav') as HTMLDivElement;

const tbody = document.querySelector('.tbody') as HTMLTableSectionElement;
let tbodyHtml: string = tbody.innerHTML;

let currentSortOrder = 'asc';
let currentPage = 1;
const pageLimit = 20;

const makeTable = async (sortField: string): Promise<void> => {
  try {
    const nameValue = (document.querySelector('.input-1') as HTMLInputElement).value;
    const capitalValue = (document.querySelector('.input-2') as HTMLInputElement).value;
    const currencyValue = (document.querySelector('.input-3') as HTMLInputElement).value;
    const languageValue = (document.querySelector('.input-4') as HTMLInputElement).value;

    const nameInUrl = nameValue ? `name_like=${nameValue}&` : '';
    const capitalUrl = capitalValue ? `capital_like=${capitalValue}&` : '';
    const currencyUrl = currencyValue ? `currency.name_like=${currencyValue}&` : '';
    const languageInUrl = languageValue ? `language.name_like=${languageValue}&` : '';

    const wholeFile = await axios.get('http://localhost:3004/countries');
    const wholePageLength = wholeFile.data.length;

    const { data }: AxiosResponse<any[]> = await axios.get(`http://localhost:3004/countries?${nameInUrl}${capitalUrl}${currencyUrl}${languageInUrl}_sort=${sortField}&_order=${currentSortOrder}&_page=${currentPage}&_limit=${pageLimit}`);
    const n = Math.ceil(wholePageLength / pageLimit);

    tableNav.innerHTML = '';
    for (let i = 1; i <= n; i += 1) {
      const pageButton: HTMLButtonElement = document.createElement('button');
      pageButton.className = 'page__Button--button';
      pageButton.innerHTML = i.toString();
      pageButton.addEventListener('click', () => paginate(i));
      tableNav.appendChild(pageButton);
    }
    tbodyHtml = '';

    for (let i = 0; i < data.length; i += 1) {
      const row = `
       <tr>
            <td>${data[i].name}</td>
            <td>${data[i].code}</td>
            <td>${data[i].capital}</td>
            <td>${data[i].region}</td>
            <td>${data[i].currency.name}</td>
            <td>${data[i].currency.symbol}</td>
            <td>${data[i].language.name}</td>
            <td>${data[i].flag}</td>
            <td>${data[i].dialling_code}</td>
            <td>${data[i].isoCode}</td>
       </tr>
       `;
      tbodyHtml += row;
    }

    tbody.innerHTML = tbodyHtml;

    currentSortOrder = currentSortOrder === 'asc' ? 'desc' : 'asc';
  } catch (error) {
    console.error('Error fetching data:', error);
  }
};

function paginate(pageNumber: number): void {
  currentPage = pageNumber;
  makeTable('name');
}

name.addEventListener('click', () => makeTable('name'));
Capital.addEventListener('click', () => makeTable('capital'));
Currency.addEventListener('click', () => makeTable('currency.name'));
Language.addEventListener('click', () => makeTable('language.name'));

document.querySelector('.input-1')?.addEventListener('input', () => makeTable('name'));
document.querySelector('.input-2')?.addEventListener('input', () => makeTable('capital'));
document.querySelector('.input-3')?.addEventListener('input', () => makeTable('currency.name'));
document.querySelector('.input-4')?.addEventListener('input', () => makeTable('language.name'));

makeTable('name');
