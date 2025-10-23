function toggleDetails(appId) {
  const detailsRow = document.getElementById('details-' + appId);
  const checkbox = document.querySelector('[onclick="toggleDetails(' + appId + ')"]');
  if (!detailsRow || !checkbox) return;
  detailsRow.style.display = checkbox.checked ? 'table-row' : 'none';
}

if (window.jQuery) {
  (function ($) {
    $(document).ready(function () {
      $('#submit').click(function (e) {
        e.preventDefault();
        let valid = true;
        // validate app name: non-empty and English letters/numbers with no spaces
        const appNameVal = $('#appName').val().trim();
        if (appNameVal === '') {
          $('#nameError').text('الرجاء إدخال اسم التطبيق');
          $('#appName').css('border', '2px solid red');
          valid = false;
        } else if (!isAsciiNoSpaces(appNameVal)) {
          $('#nameError').text('يجب استخدام أحرف إنجليزية أو أرقام بدون مسافات');
          $('#appName').css('border', '2px solid red');
          valid = false;
        } else {
          $('#nameError').text('');
          $('#appName').css('border', '');
        }
        // validate manufacturer/company: non-empty and English letters/numbers without spaces
        const manVal = $('#manufacturer').val().trim();
        if (manVal === '') {
          $('#manError').text('الرجاء إدخال اسم الشركة المصنعة');
          $('#manufacturer').css('border', '2px solid red');
          valid = false;
        } else if (!isAsciiNoSpaces(manVal)) {
          $('#manError').text('يجب استخدام أحرف إنجليزية أو أرقام بدون مسافات');
          $('#manufacturer').css('border', '2px solid red');
          valid = false;
        } else {
          $('#manError').text('');
          $('#manufacturer').css('border', '');
        }
        if ($('#website').val().trim() === '') {
              $('#urlError').text('الرجاء إدخال الموقع الإلكتروني');
              $('#website').css('border', '2px solid red');
              valid = false;
            } else if (!isValidUrl($('#website').val().trim())) {
              $('#urlError').text('الرجاء إدخال رابط صالح يبدأ بـ http:// أو https://');
              $('#website').css('border', '2px solid red');
              valid = false;
        } else {
          $('#urlError').text('');
          $('#website').css('border', '');
        }
        if ($("input[name='free']:checked").length === 0) {
          alert('الرجاء اختيار ما إذا كان التطبيق مجانيًا أم لا');
          valid = false;
        }
        if ($('#category').val() === '') {
          alert('الرجاء اختيار مجال الاستخدام');
          valid = false;
        }
        if ($('#description').val().trim() === '') {
          alert('الرجاء إدخال وصف للتطبيق');
          valid = false;
        }
        if (valid) {
          const appName = encodeURIComponent($('#appName').val().trim());
          const manufacturer = encodeURIComponent($('#manufacturer').val().trim());
          const category = encodeURIComponent($('#category').val());
          const isFree = encodeURIComponent($("input[name='free']:checked").val());
          const website = encodeURIComponent($('#website').val().trim());
          const description = encodeURIComponent($('#description').val().trim());
          const url = `apps.html?name=${appName}&man=${manufacturer}&cat=${category}&free=${isFree}&web=${website}&desc=${description}`;
          window.location.href = url;
        }
      });

      $('#reset').click(function () {
        $('form')[0].reset();
        $('input, textarea, select').css('border', '');
        $('.error').text('');
      });
    });
  })(window.jQuery);
}

function addAppFromQuery() {
  try {
    const params = new URLSearchParams(window.location.search);
    if (!params.has('name')) return;

    const name = decodeURIComponent(params.get('name') || '');
    const man = decodeURIComponent(params.get('man') || '');
    const cat = decodeURIComponent(params.get('cat') || '');
    const free = decodeURIComponent(params.get('free') || '');
    const web = decodeURIComponent(params.get('web') || '');
    const desc = decodeURIComponent(params.get('desc') || '');

    const tbody = document.querySelector('main table tbody') || document.querySelector('table tbody');
    if (!tbody) return;
    const details = document.querySelectorAll('tr[id^="details-"]');
    let maxId = 0;
    details.forEach(d => {
      const m = d.id.match(/details-(\d+)/);
      if (m) maxId = Math.max(maxId, parseInt(m[1], 10));
    });
    const newId = maxId + 1;

    // safe-escape helpers
    function escapeHtml(str) {
      if (!str) return '';
      return String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
    }
    function escapeAttr(str) {
      if (!str) return '';
      return String(str).replace(/"/g, '%22');
    }

    const mainRow = `<tr>\n  <td>${escapeHtml(name)}</td>\n  <td>${escapeHtml(man)}</td>\n  <td>${escapeHtml(cat)}</td>\n  <td>${escapeHtml(free)}</td>\n  <td><input type="checkbox" class="details-toggle" onclick="toggleDetails(${newId})"></td>\n</tr>`;

    const detailsRow = `\n<tr id="details-${newId}" style="display:none;"><td colspan="5"><div class="app-details">` +
      `<div class="detail-item"><strong>الموقع:</strong> <a href="${escapeAttr(web)}" target="_blank">${escapeHtml(web)}</a></div>` +
      `<div class="detail-item"><strong>وصف:</strong><p>${escapeHtml(desc)}</p></div>` +
      `</div></td></tr>`;

    tbody.insertAdjacentHTML('beforeend', mainRow + detailsRow);
    if (window.history && window.history.replaceState) {
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  } catch (e) {
    console.error('addAppFromQuery error', e);
  }
}
function isValidUrl(s) {
  try {
    const url = new URL(s);
    return url.protocol === 'http:' || url.protocol === 'https:';
  } catch (e) {
    return false;
  }
}

// Check string contains only ASCII letters and digits with no spaces
function isAsciiNoSpaces(s) {
  if (!s) return false;
  return /^[A-Za-z0-9_-]+$/.test(s);
}
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', addAppFromQuery);
} else {
  addAppFromQuery();
}

