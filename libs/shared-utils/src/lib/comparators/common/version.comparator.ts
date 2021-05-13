
export function compareVersions(newVersion: string, currentVersion: string): boolean
{
  if (!newVersion || !currentVersion)
  {
    return false;
  }
  // compares version_a as it relates to version_b
  // a = b => "same"
  // a > b => "larger"
  // a < b => "smaller"
  // NaN   => "invalid"

  const arr_a = newVersion.split('.');
  const arr_b = currentVersion.split('.');

  let result = 'same'; // initialize to same // loop tries to disprove

  // loop through a and check each number against the same position in b
  for (let i = 0; i < arr_a.length; i++)
  {
    let a = parseInt(arr_a[i], 10);
    let b = parseInt(arr_b[i], 10);

    // same up to this point so if a is not there, a is smaller
    if (typeof a === 'undefined')
    {
      result = 'smaller';
      break;

      // same up to this point so if b is not there, a is larger
    }
    else if (typeof b === 'undefined')
    {
      result = 'larger';
      break;

      // otherwise, compare the two numbers
    }
    else
    {
      // non-positive numbers are invalid
      if (a >= 0 && b >= 0)
      {
        if (a < b)
        {
          result = 'smaller';
          break;
        }
        else if (a > b)
        {
          result = 'larger';
          break;
        }
      }
      else
      {
        result = 'invalid';
        break;
      }
    }
  }

  // account for the case where the loop ended but there was still a position in b to evaluate
  if (result === 'same' && arr_b.length > arr_a.length)
  {
    result = 'smaller';
  }

  switch (result)
  {
    case "larger":
      return true;
    default:
      return false;
  }
}
