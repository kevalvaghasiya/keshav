let collection;
document.addEventListener('DOMContentLoaded', async function () {
  const app = new Realm.App({ id: "application-0-rfiqg" });
  const credentials = Realm.Credentials.anonymous();
  const user = await app.logIn(credentials);
  const mongodb = user.mongoClient("mongodb-atlas");
  const database = mongodb.db("keshav");
  collection = database.collection("keshav");

  //aa line na chala nai karva na
  ////// await collection.deleteMany({})
});

let itineraryItemData;
let itemArray = [];
let selectedId = '';

if (document.getElementById('itinerary_item')) {
  CKEDITOR.replace('itinerary_item'); //package itinerary_item

  CKEDITOR.instances.itinerary_item.on('change', function () {
    itineraryItemData = this.getData();
    // document.getElementById('shdual_block').innerHTML = itineraryItemData;
  });
}


function generateUUID() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

async function createNew() {
  let pkgName = document.getElementById('c_name').value;
  if (itineraryItemData && pkgName) {

    if (selectedId !== '') {
      await collection.updateOne({ pid: selectedId }, { $set: { name: pkgName, pkgStr: itineraryItemData } });
      selectedId = '';
      document.getElementById('sbmt_upd_btn').innerText = 'Submit';
    }
    else {
      let itemObj = {
        pid: generateUUID(),
        name: pkgName,
        pkgStr: itineraryItemData
      }
      // const doc = { name: "Jane Doe", pid: generateUUID(), pkgStr: 'djsgdfjgsdjf' };
      await collection.insertOne(itemObj);
    }
    document.getElementById('c_name').value = '';
    CKEDITOR.instances.itinerary_item.setData('');
    //call function for get all data 
    getAllItemData();
  }
  else {
    alert('both data required')
  }
}


// index page code here 
// table code 
let hotel_room = `<tr>
                    <td>{{PLACE}}</td>
                    <td>{{HOTEL_NAME}}</td>
                    <td>{{ROOM_TYPE}}</td>
                    <td>{{NIGHTS}}</td>
                    <td>{{HOTEL_TYPE}}</td>
                  </tr>`;
let hotel_room_action = `<tr>
                    <td>{{PLACE}}</td>
                    <td>{{HOTEL_NAME}}</td>
                    <td>{{ROOM_TYPE}}</td>
                    <td>{{NIGHTS}}</td>
                    <td>{{HOTEL_TYPE}}</td>
                    <td class="td_span"><span onclick="editData({{I}})">Edit</span><span onclick="deleteData({{I}})">delete</span></td>
                  </tr>`;

let editIindex = '';

let hotel_arr = [];

const addHotelData = () => {
  let destination = document.getElementById('c_place').value;
  let hotel = document.getElementById('c_htl').value;
  let room = document.getElementById('c_room').value;
  let nights = document.getElementById('c_ngt').value;
  let hotel_type = document.getElementById('c_htl_typ').value;

  if (editIindex !== '') {
    hotel_arr[editIindex].destination = destination;
    hotel_arr[editIindex].hotel = hotel;
    hotel_arr[editIindex].room = room;
    hotel_arr[editIindex].nights = nights;
    hotel_arr[editIindex].hotel_type = hotel_type;
    document.getElementById('tbl_htl_btn').value = 'Add';
    editIindex = '';
  }
  else {
    hotel_arr.push({
      destination, nights,
      hotel, room, hotel_type
    });
  }

  document.getElementById('c_place').value = '';
  document.getElementById('c_htl').value = '';
  document.getElementById('c_room').value = '';
  document.getElementById('c_ngt').value = '';
  document.getElementById('c_htl_typ').value = '';

  updateDataToTable();
}

const updateDataToTable = () => {
  let newTr = '';
  let newTrAction = '';
  for (let i = 0; i < hotel_arr.length; i++) {
    const h = hotel_arr[i];
    newTr += hotel_room.replace(/{{PLACE}}/gi, h.destination)
      .replace(/{{HOTEL_NAME}}/gi, h.hotel)
      .replace(/{{ROOM_TYPE}}/gi, h.room)
      .replace(/{{NIGHTS}}/gi, h.nights)
      .replace(/{{HOTEL_TYPE}}/gi, h.hotel_type);
  }
  document.getElementById('hotal_body_tr').innerHTML = newTr;

  for (let i = 0; i < hotel_arr.length; i++) {
    const h = hotel_arr[i];
    newTrAction += hotel_room_action.replace(/{{PLACE}}/gi, h.destination)
      .replace(/{{HOTEL_NAME}}/gi, h.hotel)
      .replace(/{{ROOM_TYPE}}/gi, h.room)
      .replace(/{{NIGHTS}}/gi, h.nights)
      .replace(/{{HOTEL_TYPE}}/gi, h.hotel_type)
      .replace(/{{DATA}}/gi, h)
      .replace(/{{I}}/gi, i)
  }
  document.getElementById('hotal_list').innerHTML = newTrAction;
}

const editData = (index) => {
  document.getElementById('c_place').value = hotel_arr[index].destination;
  document.getElementById('c_htl').value = hotel_arr[index].hotel;
  document.getElementById('c_room').value = hotel_arr[index].room;
  document.getElementById('c_ngt').value = hotel_arr[index].nights;
  document.getElementById('c_htl_typ').value = hotel_arr[index].hotel_type;

  editIindex = index;

  document.getElementById('tbl_htl_btn').value = 'Update';
}

const deleteData = (index) => {
  hotel_arr.splice(index, 1);

  updateDataToTable();
}
// table code end 


//handle input change 
const handleChange = (typ) => {
  if (typ == 'name') {
    document.getElementById('cmr_name').innerText = document.getElementById('c_nm').value
  }
  else if (typ == 'number') {
    document.getElementById('prson_cnt').innerText = document.getElementById('c_mmbr').value
  }
  else if (typ == 'duration') {
    document.getElementById('drtn_txt').innerText = document.getElementById('c_duration').value
  }
  else if (typ == 'arrival') {
    document.getElementById('start_point').innerText = document.getElementById('c_arrival').value
  }
  else if (typ == 'departure') {
    document.getElementById('and_point').innerText = document.getElementById('c_departure').value
  }
  else if (typ == 'destination') {
    document.getElementById('pkg_sedti').innerText = document.getElementById('c_destination').value
  }
}


const fromDate = document.getElementById('fromDate');
const toDate = document.getElementById('toDate');

if (fromDate) {
  fromDate.addEventListener('change', updateRange);
  toDate.addEventListener('change', updateRange);
}

function updateRange() {
  if (fromDate.value && toDate.value) {
    document.getElementById('pckg_date').textContent = fromDate.value + ' to ' + toDate.value;
  }
}

// input change end


// start ck editor code 
if (document.getElementById('incld_data')) {

  // Set default configuration for all CKEditor instances
  CKEDITOR.config.height = 100;
  CKEDITOR.replace('include');//package includes
  CKEDITOR.replace('exclude');//package excludes
  CKEDITOR.replace('note');//package note
  CKEDITOR.replace('itinerary'); //package itinerary


  CKEDITOR.instances.include.on('change', function () {
    var includeData = this.getData();
    document.getElementById('incld_data').innerHTML = includeData;
  });

  CKEDITOR.instances.exclude.on('change', function () {
    var excludeData = this.getData();
    document.getElementById('excld_data').innerHTML = excludeData;
  });

  CKEDITOR.instances.note.on('change', function () {
    var noteData = this.getData();
    document.getElementById('note_data').innerHTML = noteData;
  });



  CKEDITOR.instances.itinerary.on('change', function () {
    let itineraryData = this.getData();
    document.getElementById('shdual_block').innerHTML = itineraryData;
  });
}
///end


/// create pdf code 
function generatePDF() {
  var element = document.getElementById('outer');

  var opt = {
    margin: [0, 0, 0, 0], // Adjust the margins if needed
    filename: 'pdf-with-fixed-text-linse.pdf',
    pagebreak: { mode: 'css' },
    jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
    html2canvas: { scale: 2 },
  };

  html2pdf().set(opt).from(element).toPdf().get('pdf').then(function (pdf) {
    var totalPages = pdf.internal.getNumberOfPages();
    var imgData = '/keshav-trans.png'; // Replace with your base64 image string
    var customWidth = 100; // Custom width in mm
    var customHeight = 50; // Custom height in mm
    var xPos = (pdf.internal.pageSize.getWidth() - customWidth) / 2; // Center the image
    var yPos = (pdf.internal.pageSize.getHeight() - customHeight) / 2; // Center the image

    var borderColor = ['#b4fed2', '#203bda', '#9fdd09'];

    for (var i = 1; i <= totalPages; i++) {
      pdf.setPage(i);

      // Set the border color
      pdf.setDrawColor(borderColor[0], borderColor[1], borderColor[2]);

      // Add border to the current page
      var pageWidth = pdf.internal.pageSize.getWidth();
      var pageHeight = pdf.internal.pageSize.getHeight();
      // pdf.setLineWidth(1);
      // pdf.rect(5, 5, pageWidth - 10, pageHeight - 10);

      pdf.setLineWidth(0.5); // You can set the line width here
      pdf.line(5, 0, 5, pageHeight); // Left line
      pdf.line(pageWidth - 5, 0, pageWidth - 5, pageHeight); // Right line
      pdf.line(3, 0, 3, pageHeight); // Left line
      pdf.line(pageWidth - 3, 0, pageWidth - 3, pageHeight); // Right line



      pdf.addImage(imgData, 'JPEG', xPos, yPos, customWidth, customHeight);
    }

    pdf.setPage(totalPages);

    // Add fixed text at the bottom of the last page
    var text = "F5/ Keshav tour, saragm dr.house, near sonal bhel, hirabagh, surat.   +917600150060";
    var textWidth = pdf.getStringUnitWidth(text) * pdf.internal.getFontSize() / pdf.internal.scaleFactor;
    var textX = (pdf.internal.pageSize.getWidth() - 60) / 20; // Center the text
    var textY = pdf.internal.pageSize.getHeight() - 3; // 10 mm from the bottom
    // pdf.setFont("Arial, sans-serif", "bold");
    pdf.setFontSize(12); // Set the font size to 12, adjust as needed
    pdf.text(text, textX, textY);
  }).save();
}



///comman code 
const getAllItemData = async () => {
  itemArray = await collection.find({});
  //call function for create drop dwon
  fnForCreateDrp();
}

function fnForCreateDrp() {
  if (document.getElementById('myDropdown')) {
    document.getElementById('myDropdown').remove()
  }
  const dropdown = document.createElement('select');
  dropdown.setAttribute('onchange', 'handleSelectionChange()');
  dropdown.id = 'myDropdown'; // Set an ID for easy access in the JavaScript function
  dropdown.className = 'drp-dwn';
  const option = document.createElement('option');
  option.value = 'Select';
  option.textContent = 'Select';
  dropdown.appendChild(option);

  // Populate the dropdown with options
  itemArray.forEach(item => {
    const option = document.createElement('option');
    option.value = item.pid;
    option.textContent = item.name;
    dropdown.appendChild(option);
  });
  if (document.getElementById('create_option')) {
    document.getElementById('create_option').appendChild(dropdown);
  }
  else {
    document.getElementById('list_option').appendChild(dropdown);
  }
}

async function handleSelectionChange() {
  const dropdown = document.getElementById('myDropdown');
  const selectedValue = dropdown.value;
  if (selectedValue == 'Select') return;

  selectedId = selectedValue;

  let selectedObj = await collection.findOne({ pid: selectedId });
  if (document.getElementById('create_option')) {
    document.getElementById('c_name').value = selectedObj.name;
    CKEDITOR.instances.itinerary_item.setData(selectedObj.pkgStr);
    document.getElementById('sbmt_upd_btn').innerText = 'Update'
  }
  else {
    document.getElementById('list_option').appendChild(dropdown);
    CKEDITOR.instances.itinerary.setData(selectedObj.pkgStr);
  }
  // You can perform additional actions based on the selected value here
}


setTimeout(() => {
  getAllItemData();
}, 1000);
