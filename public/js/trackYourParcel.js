const pickedUp = document.getElementById('picked-up');
const leftFacility = document.getElementById('left-facility');
const outForDelevery = document.getElementById('out-for-delevery');
const delevered = document.getElementById('delevered');
const f1 = document.getElementById('1');
const f2 = document.getElementById('2');
const f3 = document.getElementById('3');
const f4 = document.getElementById('4');


async function getCurrentStatusData() {
  const data = await fetch('/trackYourParcel/currentStatusData');
  const currentStatus = await data.json();
  console.log(currentStatus);

  if (currentStatus.data.length > 0) {
    if (currentStatus.data[0].currentStatus === 'Picked Up') {
      pickedUp.classList.remove('bg-danger');
      f2.classList.remove('n-d');

      pickedUp.classList.add('shows');
      f1.classList.add('d');
    }
    if (currentStatus.data[0].currentStatus === 'Left Facility') {
      pickedUp.classList.remove('bg-danger');
      leftFacility.classList.remove('bg-danger');
      f1.classList.remove('n-d');
      f2.classList.remove('n-d');

      pickedUp.classList.add('shows');
      leftFacility.classList.add('shows');
      f1.classList.add('d');
      f2.classList.add('d');
    }
    if (currentStatus.data[0].currentStatus === 'Out For Delevery') {
      pickedUp.classList.remove('bg-danger');
      leftFacility.classList.remove('bg-danger');
      outForDelevery.classList.remove('bg-danger');
      f1.classList.remove('n-d');
      f2.classList.remove('n-d');
      f3.classList.remove('n-d');

      pickedUp.classList.add('shows');
      leftFacility.classList.add('shows');
      outForDelevery.classList.add('shows');
      f1.classList.add('d');
      f2.classList.add('d');
      f3.classList.add('d');
    }
    if (currentStatus.data[0].currentStatus === 'Delevered') {
      pickedUp.classList.remove('bg-danger');
      leftFacility.classList.remove('bg-danger');
      outForDelevery.classList.remove('bg-danger');
      delevered.classList.remove('bg-danger');
      f1.classList.remove('n-d');
      f2.classList.remove('n-d');
      f3.classList.remove('n-d');
      f4.classList.remove('n-d');

      pickedUp.classList.add('shows');
      leftFacility.classList.add('shows');
      outForDelevery.classList.add('shows');
      delevered.classList.add('shows');
      f1.classList.add('d');
      f2.classList.add('d');
      f3.classList.add('d');
      f4.classList.add('d');
    }
  }
}
getCurrentStatusData();
