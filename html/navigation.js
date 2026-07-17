var sidebar = document.getElementById('sidebar');

sidebar.innerHTML =
  "<div class='sidebar-brand'>" +
    "<div class='brand-mark' aria-hidden='true'><span></span></div>" +
    "<div class='brand-copy'><strong>RTLPlayground</strong><span data-i18n='ui_switch_management'>Switch Management</span></div>" +
  "</div>" +
  "<ul>" +
    "<li><a href='index.html'><span class='nav-icon' aria-hidden='true'>&#8962;</span><span data-i18n='nav_overview'>Overview</span></a></li>" +
    "<li><a href='ports.html'><span class='nav-icon' aria-hidden='true'>&#9638;</span><span data-i18n='nav_port_config'>Port Configuration</span></a></li>" +
    "<li><a href='stat.html'><span class='nav-icon' aria-hidden='true'>&#9646;</span><span data-i18n='nav_port_stat'>Port Statistics</span></a></li>" +
    "<li class='nav-separator'></li>" +
    "<li><a href='vlan.html'><span class='nav-icon' aria-hidden='true'>&#9671;</span><span>VLAN</span></a></li>" +
    "<li><a href='l2.html'><span class='nav-icon' aria-hidden='true'>&#9636;</span><span data-i18n='nav_l2'>L2 Configuration</span></a></li>" +
    "<li><a href='mirror.html'><span class='nav-icon' aria-hidden='true'>&#8644;</span><span data-i18n='nav_mirror'>Mirroring</span></a></li>" +
    "<li><a href='lag.html'><span class='nav-icon' aria-hidden='true'>&#8734;</span><span data-i18n='nav_lag'>Link Aggregation</span></a></li>" +
    "<li><a href='eee.html'><span class='nav-icon' aria-hidden='true'>&#9675;</span><span data-i18n='nav_eee'>EEE</span></a></li>" +
    "<li><a href='bandwidth.html'><span class='nav-icon' aria-hidden='true'>&#9711;</span><span data-i18n='nav_bandwidth'>Bandwidth Limits</span></a></li>" +
    "<li class='nav-separator'></li>" +
    "<li><a href='system.html'><span class='nav-icon' aria-hidden='true'>&#9881;</span><span data-i18n='nav_system'>System Settings</span></a></li>" +
    "<li><a href='update.html'><span class='nav-icon' aria-hidden='true'>&#8679;</span><span data-i18n='nav_fw_update'>Firmware Update</span></a></li>" +
  "</ul>" +
  "<div class='sidebar-footer'>" +
    "<div class='device-state is-unknown'><span class='status-dot'></span><span class='device-state-text' data-i18n='ui_unknown'>Unknown</span></div>" +
    "<label class='language-picker'><span data-i18n='ui_language'>Language</span><select id='languageSelect' data-i18n-aria-label='ui_language' aria-label='Language'><option value='en'>EN</option><option value='zh'>中文</option><option value='ja'>日本語</option></select></label>" +
  "</div>";

var currentPage = window.location.pathname.split('/').pop() || 'index.html';
var links = sidebar.querySelectorAll('a');
for (var i = 0; i < links.length; i++) {
  if (links[i].getAttribute('href') === currentPage) {
    links[i].classList.add('active');
    links[i].setAttribute('aria-current', 'page');
  }
}

var toggle = document.createElement('button');
toggle.className = 'nav-toggle';
toggle.type = 'button';
toggle.setAttribute('aria-label', t('ui_toggle_navigation'));
toggle.setAttribute('aria-controls', 'sidebar');
toggle.setAttribute('aria-expanded', 'false');
toggle.innerHTML = '&#9776;';

var mobileHeader = document.createElement('header');
mobileHeader.className = 'mobile-header';
mobileHeader.appendChild(toggle);
var mobileBrand = document.createElement('strong');
mobileBrand.textContent = 'RTLPlayground';
mobileHeader.appendChild(mobileBrand);
var mobileState = document.createElement('span');
mobileState.className = 'mobile-state';
mobileState.innerHTML = "<span class='status-dot'></span><span class='device-state-text'>" + t('ui_unknown') + "</span>";
mobileHeader.appendChild(mobileState);
document.body.appendChild(mobileHeader);

var backdrop = document.createElement('div');
backdrop.className = 'nav-backdrop';
document.body.appendChild(backdrop);

function syncNavigationState(returnFocus) {
  var mobile = window.matchMedia('(max-width: 820px)').matches;
  var open = mobile && document.body.classList.contains('nav-open');
  toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
  if (mobile) {
    sidebar.setAttribute('aria-hidden', open ? 'false' : 'true');
    sidebar.inert = !open;
  } else {
    sidebar.removeAttribute('aria-hidden');
    sidebar.inert = false;
  }
  if (returnFocus) toggle.focus();
}

function setNavigationOpen(open, returnFocus) {
  document.body.classList.toggle('nav-open', open);
  syncNavigationState(returnFocus);
  if (open) {
    var firstLink = sidebar.querySelector('a');
    if (firstLink) firstLink.focus();
  }
}

toggle.onclick = function() {
  setNavigationOpen(!document.body.classList.contains('nav-open'), false);
};
backdrop.onclick = function() { setNavigationOpen(false, true); };

for (var j = 0; j < links.length; j++) {
  links[j].onclick = function() { setNavigationOpen(false, false); };
}

document.addEventListener('keydown', function(event) {
  if (event.key === 'Escape' && document.body.classList.contains('nav-open'))
    setNavigationOpen(false, true);
});
window.addEventListener('resize', function() { syncNavigationState(false); });

function translateNavigation() {
  document.documentElement.lang = rtlLang;
  var translatedLinks = sidebar.querySelectorAll('[data-i18n]');
  for (var i = 0; i < translatedLinks.length; i++) {
    var key = translatedLinks[i].getAttribute('data-i18n');
    if (key) translatedLinks[i].textContent = t(key);
  }
}

function setGlobalDeviceState(state) {
  var online = state === 'online';
  var offline = state === 'offline';
  var text = t(online ? 'ui_online' : offline ? 'ui_offline' : 'ui_unknown');
  var targets = document.querySelectorAll('.device-state, .mobile-state');
  for (var i = 0; i < targets.length; i++) {
    targets[i].classList.toggle('is-online', online);
    targets[i].classList.toggle('is-offline', offline);
    targets[i].classList.toggle('is-unknown', !online && !offline);
    var label = targets[i].querySelector('.device-state-text');
    if (label) label.textContent = text;
  }
  var liveTargets = document.querySelectorAll('.status-pill:not(.neutral), .live-pill');
  for (var j = 0; j < liveTargets.length; j++) {
    liveTargets[j].classList.toggle('is-offline', offline);
    liveTargets[j].classList.toggle('is-unknown', !online && !offline);
    var stateLabel = liveTargets[j].querySelector('.status-state-text');
    if (stateLabel)
      stateLabel.textContent = online ? t(liveTargets[j].classList.contains('live-pill') ? 'ui_live' : 'ui_online') : text;
  }

  var summaryValue = document.getElementById('summaryDeviceStatus');
  var summaryDetail = document.getElementById('summaryDeviceStatusDetail');
  var summaryIcon = document.getElementById('summaryDeviceStatusIcon');
  if (summaryValue) {
    summaryValue.textContent = text;
    summaryValue.classList.toggle('success-text', online);
    summaryValue.classList.toggle('danger-text', offline);
  }
  if (summaryDetail)
    summaryDetail.textContent = t(online ? 'ui_management_available' : offline ? 'ui_management_unreachable' : 'ui_waiting_status');
  if (summaryIcon) {
    summaryIcon.textContent = online ? '\u2713' : offline ? '!' : '?';
    summaryIcon.classList.toggle('success', online);
    summaryIcon.classList.toggle('danger', offline);
  }
}

var languageSelect = document.getElementById('languageSelect');
languageSelect.value = rtlLang;
languageSelect.onchange = function() {
  setLang(this.value);
  window.location.reload();
};

function prepareResponsiveTable(table) {
  var rows = table.rows;
  if (!rows.length) return;
  var headerIndex = 0;
  var headerRows = [];
  for (var i = 0; i < rows.length; i++) {
    if (rows[i].querySelector('th')) {
      rows[i].classList.add('table-header-row');
      headerRows.push(rows[i]);
      headerIndex = i;
    } else {
      break;
    }
  }
  var headers = rows[headerIndex].querySelectorAll('th');
  var groups = [];
  for (var groupRow = 0; groupRow < headerRows.length - 1; groupRow++) {
    var groupCells = headerRows[groupRow].querySelectorAll('th');
    var column = 0;
    for (var groupCell = 0; groupCell < groupCells.length; groupCell++) {
      var span = parseInt(groupCells[groupCell].getAttribute('colspan') || '1', 10);
      var groupText = groupCells[groupCell].textContent.trim();
      for (var offset = 0; offset < span; offset++) {
        if (groupText) groups[column + offset] = groupText;
      }
      column += span;
    }
  }
  for (var rowIndex = headerIndex + 1; rowIndex < rows.length; rowIndex++) {
    var cells = rows[rowIndex].cells;
    for (var cellIndex = 0; cellIndex < cells.length; cellIndex++) {
      var header = headers[cellIndex];
      var label = header ? header.textContent.trim() : '';
      if (groups[cellIndex] && groups[cellIndex] !== label)
        label = groups[cellIndex] + ' · ' + label;
      cells[cellIndex].setAttribute('data-label', label);
    }
  }
  table.classList.add('responsive-table');
}

function prepareResponsiveTables() {
  var selectors = '#speedtable,#mtutable,#statstable,#vlanTable,#l2table,#eeetable,#bwtable';
  var tables = document.querySelectorAll(selectors);
  for (var i = 0; i < tables.length; i++) prepareResponsiveTable(tables[i]);
}

prepareResponsiveTables();
if (window.MutationObserver) {
  var tableObserver = new MutationObserver(prepareResponsiveTables);
  var observedTables = document.querySelectorAll('#speedtable,#mtutable,#statstable,#vlanTable,#l2table,#eeetable,#bwtable');
  for (var k = 0; k < observedTables.length; k++)
    tableObserver.observe(observedTables[k], { childList: true, subtree: true });
}

translateNavigation();
syncNavigationState(false);
setGlobalDeviceState('unknown');
document.addEventListener('DOMContentLoaded', function() {
  translateNavigation();
  prepareResponsiveTables();
});
