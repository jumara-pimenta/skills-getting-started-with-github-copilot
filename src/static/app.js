document.addEventListener("DOMContentLoaded", function () {
  const activitiesList = document.getElementById("activities-list");
  const activitySelect = document.getElementById("activity");
  const signupForm = document.getElementById("signup-form");
  const messageDiv = document.getElementById("message");

  // Fetch activities from the API
  fetch("/activities")
    .then((response) => response.json())
    .then((data) => {
      activitiesList.innerHTML = "";
      activitySelect.innerHTML = '<option value="">-- Select an activity --</option>';

      for (const [activityName, activityDetails] of Object.entries(data)) {
        // Create activity card
        const activityCard = document.createElement("div");
        activityCard.className = "activity-card";
        activityCard.innerHTML = `
          <h4>${activityName}</h4>
          <p>${activityDetails.description}</p>
          <p><strong>Schedule:</strong> ${activityDetails.schedule}</p>
          <p><strong>Participants:</strong> ${activityDetails.participants.join(", ")}</p>
        `;
        activitiesList.appendChild(activityCard);

        // Add activity to select options
        const option = document.createElement("option");
        option.value = activityName;
        option.textContent = activityName;
        activitySelect.appendChild(option);
      }
    })
    .catch((error) => {
      activitiesList.innerHTML = "<p>Error loading activities.</p>";
      console.error("Error fetching activities:", error);
    });

  // Handle form submission
  signupForm.addEventListener("submit", function (event) {
    event.preventDefault();
    const email = document.getElementById("email").value;
    const activity = document.getElementById("activity").value;

    if (!activity) {
      messageDiv.textContent = "Please select an activity.";
      messageDiv.className = "message error";
      messageDiv.classList.remove("hidden");
      return;
    }

    fetch(`/activities/${activity}/signup?email=${email}`, {
      method: "POST",
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.detail) {
          messageDiv.textContent = data.detail;
          messageDiv.className = "message error";
        } else {
          messageDiv.textContent = data.message;
          messageDiv.className = "message success";
        }
        messageDiv.classList.remove("hidden");
      })
      .catch((error) => {
        messageDiv.textContent = "Error signing up for activity.";
        messageDiv.className = "message error";
        messageDiv.classList.remove("hidden");
        console.error("Error signing up for activity:", error);
      });
  });
});
