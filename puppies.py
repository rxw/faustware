import giphy_client
import random
from PIL import Image, ImageDraw, ImageSequence, ImageFont
import requests
import io
from giphy_client.rest import ApiException

def create_puppy_image():
    # create an instance of the API class
    api_instance = giphy_client.DefaultApi()
    api_key = 'dj5t6kTSqTp7uE4EoZvOUpI4pChPFQf3' # str | Giphy API Key.
    q = 'puppies' # str | Search query term or prhase.
    limit = 25 # int | The maximum number of records to return. (optional) (default to 25)
    offset = 0 # int | An optional results offset. Defaults to 0. (optional) (default to 0)
    lang = 'en' # str | Specify default country for regional content; use a 2-letter ISO 639-1 country code. See list of supported languages <a href = \"../language-support\">here</a>. (optional)
    fmt = 'json' # str | Used to indicate the expected response format. Default is Json. (optional) (default to json)

    try: 
        # Search Endpoint
        api_response = api_instance.gifs_search_get(api_key, q, limit=limit, offset=offset, lang=lang, fmt=fmt)
    except ApiException as e:
        raise e

    res = api_response.to_dict()
    gif = random.choice(res['data'])
    url = f"https://i.giphy.com/media/{gif['id']}/200w.gif"
    mv = requests.get(url).content
    im = Image.open(io.BytesIO(mv))

    font = ImageFont.truetype('Owl Cute.ttf', 20)
    # A list of the frames to be outputted
    frames = []
    # Loop over each frame in the animated image
    for frame in ImageSequence.Iterator(im):
        # Draw the text on the frame
        d = ImageDraw.Draw(frame)
        d.text((10,60), "puppies love saby!", font=font, stroke_width=5, stroke_fill="black")
        del d

        # However, 'frame' is still the animated image with many frames
        # It has simply been seeked to a later frame
        # For our list of frames, we only want the current frame

        # Saving the image without 'save_all' will turn it into a single frame image, and we can then re-open it
        # To be efficient, we will save it to a stream, rather than to file
        b = io.BytesIO()
        frame.save(b, format="GIF")
        frame = Image.open(b)

        # Then append the single frame image to a list of frames
        frames.append(frame)
    # Save the frames as a new image
    frames[0].save('serve/saby.gif', save_all=True, append_images=frames[1:])
