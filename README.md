# volto-advanced-variations

A [Plone/volto](https://plone.org/why-plone) [block](https://6.dev-docs.plone.org/volto/blocks/index.html) [add-on](https://6.dev-docs.plone.org/volto/addons/index.html) that add two new variations to the listing and search blocks.


## Features

Based on [codesyntax/volto-listingadvanced-variation](https://github.com/codesyntax/volto-listingadvanced-variation) this addon add events options including dates times and location, displaying this listing or search as a carousel/slider or image gallery.

0.5.0 Volto-light-theme support and Background image URL correction

0.4.0: Added show Creator/Author support and option.

0.2.0: Added event recurrence support and option. if enable the event will show the future recurrence of the events and
will overwrite the order of the items.
### Listing options

A example of Listing options Sidebar, it look like the following capture:

![Listing options](https://raw.githubusercontent.com/rnunez80/volto-advanced-variations/main/listing-options.png "Listing options")

---

### Carousel options

A example of Carousel options Sidebar, it look like the following capture:

![Carousel options](https://raw.githubusercontent.com/rnunez80/volto-advanced-variations/main/carousel-options.png "Carousel options")

---

## Advanced Listing properties

1. `titleTag` (_choice_): items heading level.
1. `howManyColumns` (_choice_): you can have one to four columns.
1. `imageSide` (_choice_): where the image will show, top, left, bottom, right background or no image.
1. `imageWidth` (_choice_): if the image shows left or right you can specify the width within the item div.
1. `showTitle` (_boolean_): Show Title.
1. `showDescription` (_boolean_): Show Description.
1. `eventCard` (_boolean_): Show event card.
1. `eventDate` (_boolean_): Show event date.
1. `eventTime` (_boolean_): Show event time.
1. `eventLocation` (_boolean_): Show event location.
1. `effectiveDate` (_boolean_): Show effective date.
1. `expirationDate` (_boolean_): Show expiration date.
1. `show as quote` (_boolean_): Show as quote.
1. `eventRecurrence` (_boolean_): Show event recurrence date and change order.

## Advanced Carousel properties

### Carousel/Slider Options

1. `howManyColumns` (_choice_): you can have one to four columns.
1. `slidesToScroll` (_choice_): how many items to scroll at a time.
1. `autoPlay` (_boolean_): auto play the carousel.
1. `autoPlaySpeed` (_number_): auto play speed in milliseconds.

### Item Display Options

1. `titleTag` (_choice_): items heading level.
1. `imageSide` (_choice_): where the image will show, top, left, bottom, right background or no image.
1. `showTitle` (_boolean_): Show Title.
1. `showDescription` (_boolean_): Show Description.
1. `eventCard` (_boolean_): Show event card.
1. `eventDate` (_boolean_): Show event date.
1. `eventTime` (_boolean_): Show event time.
1. `eventLocation` (_boolean_): Show event location.
1. `effectiveDate` (_boolean_): Show effective date.
1. `expirationDate` (_boolean_): Show expiration date.
1. `show as quote` (_boolean_): Show as quote.
1. `eventRecurrence` (_boolean_): Show event recurrence date and change order.

## Screen recording

[![Screen recording](https://img.youtube.com/vi/KhnCCyNOu28/0.jpg)](https://youtu.be/KhnCCyNOu28)

## How to contribute

See [DEVELOP.md](https://github.com/rnunez80/volto-advanced-variations/blob/main/DEVELOP.md).


## Copyright and license

The Initial Owner of the Original Code is Rafael Nunez.
All Rights Reserved.

See [LICENSE.md](https://github.com/rnunez80/volto-advanced-variations/blob/main/LICENSE.md) for details.
