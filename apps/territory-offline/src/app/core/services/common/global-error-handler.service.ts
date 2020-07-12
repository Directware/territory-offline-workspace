import {ErrorHandler, Injectable} from '@angular/core';
import {environment} from "../../../../environments/environment";

@Injectable()
export class GlobalErrorHandlerService implements ErrorHandler
{
  constructor()
  {
  }

  public handleError(error: Error)
  {
    if (environment.production)
    {
      console.error("[GLOBAL_ERROR_HANDLER]:")
      console.error(error);

      if (document.body)
      {
        document.body.classList.add("with-error");
      }

      const errorText = document.getElementById("global-error-text");

      if (errorText)
      {
        errorText.innerHTML = error.stack;
      }
      return;
    }

    throw error;
  }
}
