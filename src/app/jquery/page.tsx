'use client';
import { useEffect } from 'react';

export default function JQueryPage() {
  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://cdnjs.cloudflare.com/ajax/libs/jquery/3.7.1/jquery.min.js';
    script.onload = initializeJQuery;
    document.head.appendChild(script);
    return () => { document.head.removeChild(script); };
  }, []);

  const initializeJQuery = () => {
    const $ = (window as any).$;
    if (!$) return;

    $(document).on('click', '.delete-btn', function (this: HTMLElement) {
      const $li = $(this).parent();
      $li.fadeOut(300, () => $li.remove());
    });

    $('#addBtn').on('click', function () {
      $('#errorMessage').hide().text('');
      const inputValue = $('#itemInput').val() as string;

      if (!inputValue.trim()) {
        $('#errorMessage')
          .text('Please enter an item')
          .fadeIn()
          .delay(2000)
          .fadeOut();
      } else {
        const listItem = $(`
          <li class="flex justify-between items-center px-4 py-2 bg-white border-b last:border-b-0">
            <span class="text-gray-800">${inputValue}</span>
            <button class="delete-btn bg-red-500 hover:bg-red-600 text-white px-2 py-1 rounded">
              Delete
            </button>
          </li>
        `);

        listItem.hide().appendTo('#itemList').fadeIn();
        $('#itemInput').val('');
      }
    });

    $('#itemInput').on('keypress', function (e: any) {
      if (e.which === 13) $('#addBtn').click();
    });
  };

  return (
    <div className="font-sans max-w-lg mx-auto mt-12 p-4">
      <h1 className="text-2xl text-center text-gray-800 mb-6">
        jQuery Dynamic List
      </h1>

      <div className="flex mb-4">
        <input id="itemInput" type="text"
          placeholder="Enter an item..."
          className="flex-1 border-2 border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-300"
        />
        <button id="addBtn"
          className="ml-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded">
          Add
        </button>
      </div>

      <div id="errorMessage" className="hidden text-red-700 bg-red-100 border border-red-200 rounded px-3 py-2 mb-4"/>

      <ul id="itemList" className="bg-gray-100 rounded border border-gray-300 min-h-[200px]">

      </ul>
    </div>
  );
}
