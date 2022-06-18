var example_form = {};
example_form.utility = {};


// On load
$(document).ready(function() {
    example_form.construct();
});



example_form.construct = function() {
    // Set default values
    example_form.number_range_text = 0;

    // Start listening for events
    example_form.listen_for_events();
}



// Listen for events
example_form.listen_for_events = function(){


    // Listen for the color dropdown
    $(document).on({
        change : function(event){
            example_form.on_color_change(event.target, event);
        },
    }, '[data-event="example-form >>> color-select"]' );


    // Listen for the favorite number input
    $(document).on({
        change : function(event){
            example_form.on_favorite_number_change(event.target, event);
        },
    }, '[data-event="example-form >>> favorite-number"]' );


    // Listen for the submit button
    $(document).on({
        click : function(event){
            example_form.on_submit(event.target, event);
        },
    }, '[data-event="example-form >>> submit"]' );


    // Listen for the custom color dropdown box
    $(document).on({
        click : function(event){
            example_form.on_custom_color_dropdown_box_click(event.target, event);
        },
    }, '[data-event="example-form >>> custom-color-dropdown-box"]' );


    // Listen for the custom color dropdown box
    $(document).on({
        click : function(event){
            example_form.on_custom_color_dropdown_tray_option_click(event.target, event);
        },
    }, '[data-event="example-form >>> custom-color-dropdown-tray-option"]' );

};



example_form.on_color_change = function(element, event){
    // Elements
    var color_dropdown        = $(element);
    var form                  = color_dropdown.parent().closest('form'); // Search the DOM backwards to find the form we're inside of.
    var colored_object_option = form.find('input[type="radio"][name="colored-object"]:checked').first();

    // Vars
    var new_color            = color_dropdown.val();


    // Tell the form what the new color is now
    form.attr('data-color', new_color);

    // Reset colored object
    colored_object_option.prop('checked', false);
};



example_form.on_favorite_number_change = function(element, event){
    // Elements
    var favorite_number_field = $(element);
    var notification_span     = $('#example-form-number-range-display');
    var form                  = favorite_number_field.parent().closest('form'); // Search the DOM backwards to find the form we're inside of.

    // Vars
    var new_favorite_number = favorite_number_field.val();
    var number_range        = 'none';
    var number_range_text   = '';

    // Check what number range we're at
    if(new_favorite_number < 0){
        number_range      = "negative";
        number_range_text = "Negative numbers are cool";
    }
    else if(new_favorite_number <= 10){
        number_range      = "zero-to-ten";
        number_range_text = "Something between zero and ten, nice choice.";
    }
    else if(new_favorite_number > 10){
        number_range      = "over-ten";
        number_range_text = "Big Number! Nice choice.";
    }

    // Tell the form what the new number range is
    form.attr('data-number-range', number_range);

    // Change the Question 5 notification text
    notification_span.html(number_range_text);

    // Save the text so we can use it in the email later
    example_form.number_range_text = number_range_text;
};


// (Image how nice it would be if the native isInteger() worked everywhere)
// noinspection JSAnnotator
example_form.utility.isInteger = function(value){
    return !isNaN(value) &&
        parseInt(Number(value)) == value &&
        !isNaN(parseInt(value, 10));
};



// Submit form
example_form.on_submit = function(element, event){
    // Elements
    var submit_button         = $(element);
    var form                  = submit_button.parent().closest('form'); // Search the DOM backwards to find the form we're inside of.
    var color_dropdown        = form.find('#example-form-color-dropdown').first();
    var colored_object_option = form.find('input[type="radio"][name="colored-object"]:checked').first();
    var birth_city_field      = form.find('#example-form-birth-city').first();
    var favorite_number_field = form.find('#example-form-favorite-number').first();
    var cool_or_funny_field   = form.find('#example-form-cool-or-funny').first();

    // Vars
    var favorite_color  = color_dropdown.val();
    var colored_object  = colored_object_option.val();
    var birth_city      = birth_city_field.val();
    var favorite_number = favorite_number_field.val();
    var cool_funny_text = cool_or_funny_field.val();

    var valid_colors          = ['red','blue','green', 'yellow'];
    var is_favorite_color_ok  = (jQuery.inArray(favorite_color, valid_colors) !== -1);
    var is_colored_object_ok  = (typeof colored_object !== 'undefined');
    var is_birth_city_ok      = (birth_city.length > 0);
    var is_favorite_number_ok = example_form.utility.isInteger(favorite_number);
    var is_cool_funny_text_ok = (cool_funny_text.length > 11); // The shortest sentence in English is 5 chars "I am.", "I do!", "I go?" etc. .: Shortest 2 sentences with a space between them is 11 chars long?


    // Debug
    // alert(favorite_color);
    // alert(colored_object);
    // alert(birth_city);
    // alert(favorite_number);
    // alert(cool_funny_text);

    var is_ready = true;
    var error_message = '';
    if(!is_favorite_color_ok){
        is_ready = false;
        error_message = 'Please pick the color that you like best.';
    }
    else if(!is_colored_object_ok){
        is_ready = false;
        error_message = 'Please pick the ' + favorite_color + ' object that you like best.';
    }
    else if(!is_birth_city_ok){
        is_ready = false;
        error_message = 'Please add what city where you born in.';
    }
    else if(!is_favorite_number_ok){
        is_ready = false;
        error_message = 'Please pick your favorite number.';
    }
    else if(!is_cool_funny_text_ok){
        is_ready = false;
        error_message = 'Tell me anything cool or funny in 2 or 3 sentences';
    }



    if(is_ready)
    {
        Swal.fire({
            icon: 'success',
            title: 'Success!',
            text: 'Thank you for filling out this form'
        })


        var email_subject = 'Website Notification - Example Form Submitted';

        var email_text = 'Form Submitted:' +
            '\n --------------------- ' +
            '\n  What color do you like best?' +
            '\n  ' + favorite_color +
            '\n  ' +
            '\n  What ' + favorite_color + ' object do you like best?' +
            '\n  ' + colored_object +
            '\n  ' +
            '\n  What city were you born?' +
            '\n  ' + birth_city +
            '\n  ' +
            '\n  What is your favorite number?' +
            '\n  ' + favorite_number.toString() +
            '\n  ' +
            '\n  Tell me anything cool or funny in 2 or 3 sentences' +
            '\n  ' + cool_funny_text +
            '\n  ' +
            '\n --------------------- ' +
            '\n  In real life, I would make an AJAX call to a PHP endpoint that would add the email to a message queue in the database. Then another PHP script would find it in the queue table and attempt to send it, marking it as done if it is able to send.' +
            '\n  ' +
            '\n  But that would require someone to set up the environment, with server and database working right. Too many potential what-if\'s for a demo that needs to look good.' +
            '\n  ' +
            '\n  - Thanks for your time!' +
            '\n  - Ian M.' +
            '\n  ' +
            '\n --------------------- ';

        var email_text_encoded    = encodeURI(email_text);
        var email_subject_encoded = encodeURI(email_subject);

        window.location.href = "mailto:example@example.com?subject=" + email_subject_encoded + "&body=" + email_text_encoded;
    }
    else{
        Swal.fire({
            icon: 'error',
            title: 'Missing info...',
            text: error_message
        })
    }

};



// Click the custom color dropdown
example_form.on_custom_color_dropdown_box_click = function(element, event){
    // Elements
    var element = $(element);
    var dropdown = element.closest('[data-custom-element="color-dropdown"]');

    // Toggle tray
    example_form.custom_color_dropdown_toggle_tray(dropdown);
    //example_form.custom_color_dropdown_toggle_tray(element);
};



// Open the dropdown tray on the custom color dropdown
example_form.custom_color_dropdown_open_tray = function(dropdown_element){
    // Elements
    var dropdown = $(dropdown_element);

    // Open Tray
    dropdown.attr('data-is-tray-open', 'yes');
};



// Close the dropdown tray on the custom color dropdown
example_form.custom_color_dropdown_close_tray = function(dropdown_element){
    // Elements
    var dropdown = $(dropdown_element);

    // Close Tray
    dropdown.attr('data-is-tray-open', 'no');
};



// Toggle the dropdown tray on the custom color dropdown
example_form.custom_color_dropdown_toggle_tray = function(dropdown_element){
    // Elements
    var dropdown = $(dropdown_element);

    // Vars
    var is_tray_open_yn = dropdown.attr('data-is-tray-open');
    var is_tray_open    = (is_tray_open_yn === 'yes');

    // Toggle tray
    if(is_tray_open){
        example_form.custom_color_dropdown_close_tray(dropdown);
    }
    else{
        example_form.custom_color_dropdown_open_tray(dropdown);
    }
};




// Select an option on the custom color dropdown
example_form.on_custom_color_dropdown_tray_option_click = function(element, event){
    //alert('opt');

    // Elements
    var selected_element = $(element);
    var selected_option  = selected_element.closest('[data-custom-input-part="color-dropdown-tray-option"]');
    var dropdown         = selected_option.parent().closest('[data-custom-element="color-dropdown"]');
    var form             = dropdown.parent().closest('form');
    var color_dropdown   = form.find('#example-form-color-dropdown').first();

    // Vars
    var new_color = selected_option.attr('data-color');

    // Close the dropdown tray
    //example_form.custom_color_dropdown_close_tray(dropdown);

    // Change dropdown color
    dropdown.attr('data-color', new_color);
    dropdown.attr('data-is-tray-open', 'no');

    color_dropdown.val(new_color);
    color_dropdown.trigger("change");

    event.stopPropagation();
}
