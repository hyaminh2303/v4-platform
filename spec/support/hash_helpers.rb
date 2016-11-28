module HashHelpers
  def sum_hashes(*hashes)
    return {} if hashes.blank?
    result ||= {}

    hashes.each do |hash|
      result = sum_hash(result, hash)
    end
    result
  rescue
    {}
  end

  def sum_hash(hash1, hash2)
    return hash1 if hash2.blank?
    hash2.each do |key, _|
      if hash1[key].blank?
        hash1[key] = hash2[key]
      elsif hash2[key].is_a?(Hash)
        hash1[key] = sum_hash(hash1[key], hash2[key]) # call self
      else
        hash1[key] += hash2[key]
      end
    end

    hash1
  end
end
